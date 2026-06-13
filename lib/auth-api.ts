"use client";

export type AuthTokens = {
  access?: string;
  refresh?: string;
  accessToken?: string;
  refreshToken?: string;
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

export function normalizeAuthSuccess(response: unknown): AuthSuccess {
  const root = readRecord(response);
  const data = readRecord(root.data);
  const tokenSource = readRecord(root.tokens ?? data.tokens);
  const userSource = readRecord(data.user ?? root.user ?? data.profile ?? root.profile ?? data);
  const username = userSource.username ?? userSource.displayName ?? userSource.name;

  return {
    tokens: tokenSource as AuthTokens,
    user:
      typeof username === "string"
        ? {
            id: typeof userSource.id === "string" ? userSource.id : undefined,
            username,
            email: typeof userSource.email === "string" ? userSource.email : undefined,
            avatar: typeof userSource.avatar === "string" ? userSource.avatar : undefined,
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
