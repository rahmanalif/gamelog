import type { AuthTokens, AuthUser } from "@/lib/auth-api";

export const AUTH_STORAGE_KEY = "gamelog.auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

type TokenObj = { token?: string; value?: string; expiresAt?: string };
type StoredAuth = { user?: AuthUser | null; tokens?: AuthTokens | null };

let refreshPromise: Promise<string | undefined> | null = null;

function readRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

export function extractToken(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value;
  const record = readRecord(value);
  const nested = record.token ?? record.value;
  return typeof nested === "string" && nested.trim() ? nested : undefined;
}

function normalizeTokens(response: unknown): AuthTokens {
  const root = readRecord(response);
  const data = readRecord(root.data);
  const tokenSource = readRecord(root.tokens ?? data.tokens ?? root.auth ?? data.auth);

  const access = extractToken(
    tokenSource.access ??
      tokenSource.accessToken ??
      tokenSource.access_token ??
      root.access ??
      root.accessToken ??
      root.access_token ??
      data.access ??
      data.accessToken ??
      data.access_token,
  );
  const refresh = extractToken(
    tokenSource.refresh ??
      tokenSource.refreshToken ??
      tokenSource.refresh_token ??
      root.refresh ??
      root.refreshToken ??
      root.refresh_token ??
      data.refresh ??
      data.refreshToken ??
      data.refresh_token,
  );

  return {
    ...tokenSource,
    access: (tokenSource.access as AuthTokens["access"]) ?? access,
    refresh: (tokenSource.refresh as AuthTokens["refresh"]) ?? refresh,
    accessToken: extractToken(tokenSource.accessToken) ?? access,
    refreshToken: extractToken(tokenSource.refreshToken) ?? refresh,
    access_token: extractToken(tokenSource.access_token) ?? access,
    refresh_token: extractToken(tokenSource.refresh_token) ?? refresh,
  } as AuthTokens;
}

export function readStoredAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

export function persistAuth(user: AuthUser | null, tokens: AuthTokens | null) {
  if (typeof window === "undefined") return;
  if (user || tokens) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, tokens }));
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function getStoredAccessToken(): string | undefined {
  const tokens = readStoredAuth()?.tokens;
  return extractToken(tokens?.access) ?? extractToken(tokens?.accessToken) ?? extractToken(tokens?.access_token);
}

export function getStoredRefreshToken(): string | undefined {
  const tokens = readStoredAuth()?.tokens;
  return extractToken(tokens?.refresh) ?? extractToken(tokens?.refreshToken) ?? extractToken(tokens?.refresh_token);
}

export async function refreshStoredAuth(): Promise<string | undefined> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const stored = readStoredAuth();
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) return undefined;

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      persistAuth(null, null);
      return undefined;
    }

    const tokens = normalizeTokens(data);
    const accessToken = extractToken(tokens.access) ?? extractToken(tokens.accessToken) ?? extractToken(tokens.access_token);
    if (!accessToken) {
      persistAuth(null, null);
      return undefined;
    }

    persistAuth(stored?.user ?? null, tokens);
    return accessToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}
