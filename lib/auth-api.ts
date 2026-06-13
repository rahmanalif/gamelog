"use client";

export type AuthTokens = {
  access?: string;
  refresh?: string;
  accessToken?: string;
  refreshToken?: string;
  access_token?: string;
  refresh_token?: string;
};

export type AuthUser = {
  id?: string;
  username: string;
  email?: string;
  avatar?: string;
};

export type TwoFactorMethod = "TOTP" | "EMAIL_OTP" | "SMS_OTP" | string;

export type TwoFactorChallenge = {
  kind: "two-factor";
  challengeId: string;
  methods: TwoFactorMethod[];
};

export type AuthSuccess = {
  tokens: AuthTokens;
  user?: AuthUser;
  message?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(getErrorMessage(data, response.statusText));
  }

  return data as T;
}

function getErrorMessage(data: unknown, fallback: string) {
  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;
    const message = record.message ?? record.error;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  }

  return fallback || "Something went wrong. Please try again.";
}

function readRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function readString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
  }

  return undefined;
}

function normalizeTokens(root: Record<string, unknown>, data: Record<string, unknown>): AuthTokens {
  const tokenSource = readRecord(root.tokens ?? data.tokens ?? root.auth ?? data.auth);
  const access = readString(
    tokenSource.access,
    tokenSource.accessToken,
    tokenSource.access_token,
    root.access,
    root.accessToken,
    root.access_token,
    data.access,
    data.accessToken,
    data.access_token,
  );
  const refresh = readString(
    tokenSource.refresh,
    tokenSource.refreshToken,
    tokenSource.refresh_token,
    root.refresh,
    root.refreshToken,
    root.refresh_token,
    data.refresh,
    data.refreshToken,
    data.refresh_token,
  );

  return {
    ...tokenSource,
    access,
    refresh,
    accessToken: readString(tokenSource.accessToken, access),
    refreshToken: readString(tokenSource.refreshToken, refresh),
  } as AuthTokens;
}

export function normalizeAuthSuccess(response: unknown): AuthSuccess {
  const root = readRecord(response);
  const data = readRecord(root.data);
  const account = readRecord(data.account ?? root.account);
  const userSource = readRecord(
    data.user ??
      root.user ??
      data.currentUser ??
      root.currentUser ??
      data.profile ??
      root.profile ??
      account.user ??
      account.profile ??
      data,
  );
  const profile = readRecord(userSource.profile);
  const username = readString(
    userSource.username,
    userSource.userName,
    userSource.displayName,
    userSource.name,
    userSource.handle,
    profile.username,
    profile.userName,
    profile.displayName,
    profile.name,
    data.username,
    data.userName,
    root.username,
    root.userName,
  );
  const email = readString(userSource.email, profile.email, data.email, root.email);
  const avatar = readString(
    userSource.avatar,
    userSource.avatarUrl,
    userSource.avatarURL,
    userSource.image,
    userSource.imageUrl,
    userSource.imageURL,
    userSource.profileImage,
    userSource.profileImageUrl,
    userSource.photo,
    userSource.photoUrl,
    profile.avatar,
    profile.avatarUrl,
    profile.image,
    profile.imageUrl,
    profile.profileImage,
    profile.profileImageUrl,
  );

  return {
    tokens: normalizeTokens(root, data),
    user:
      username || email
        ? {
            id: readString(userSource.id, profile.id),
            username: username ?? email?.split("@")[0] ?? "Account",
            email,
            avatar,
          }
        : undefined,
    message: typeof root.message === "string" ? root.message : undefined,
  };
}

export function isTwoFactorChallenge(response: unknown): response is TwoFactorChallenge {
  const record = readRecord(response);
  return (
    record.kind === "two-factor" &&
    typeof record.challengeId === "string" &&
    Array.isArray(record.methods)
  );
}

export async function register(payload: {
  username: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}): Promise<{ email: string; message?: string }> {
  const response = await request<Record<string, unknown>>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = readRecord(response.data);
  return {
    email: typeof data.email === "string" ? data.email : payload.email,
    message: typeof response.message === "string" ? response.message : undefined,
  };
}

export async function confirmEmailByOtp(payload: { email: string; code: string }) {
  const response = await request<unknown>("/auth/email/verify/otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normalizeAuthSuccess(response);
}

export async function resendEmailVerification(email: string) {
  return request<{ message?: string }>("/auth/email/verify/resend", {
    method: "POST",
    body: JSON.stringify({ email, sendOtp: true, sendLink: false }),
  });
}

export async function login(payload: { email: string; password: string }) {
  const response = await request<unknown>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (isTwoFactorChallenge(response)) return response;
  return normalizeAuthSuccess(response);
}

export async function sendTwoFactorCode(payload: { challengeId: string; type: TwoFactorMethod }) {
  return request<{ message?: string }>("/auth/2fa/challenge/send", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyTwoFactorCode(payload: {
  challengeId: string;
  type: TwoFactorMethod;
  code: string;
}) {
  const response = await request<unknown>("/auth/2fa/challenge/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normalizeAuthSuccess(response);
}

export async function requestPasswordOtp(email: string) {
  return request<{ message?: string }>("/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function verifyPasswordOtp(payload: { email: string; code: string }) {
  return request<{ message?: string }>("/auth/password/reset/otp/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetPasswordWithOtp(payload: {
  email: string;
  code: string;
  password: string;
}) {
  return request<{ message?: string }>("/auth/password/reset/otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function refreshTokens(refreshToken: string) {
  const response = await request<unknown>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
  return normalizeAuthSuccess(response);
}

export async function logout(refreshToken: string) {
  await request<unknown>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  }).catch(() => {});
}

export async function registerFcmToken(
  accessToken: string,
  payload: { token: string; deviceId: string; deviceType: string },
) {
  return request<{ message?: string }>("/fcm-tokens", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}
