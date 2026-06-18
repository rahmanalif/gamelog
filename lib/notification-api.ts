import { getStoredAccessToken, refreshStoredAuth } from "@/lib/auth-session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

export type NotificationActor = {
  id: string;
  username: string | null;
  name: string | null;
  avatarUrl: string | null;
};

export type NotificationEntry = {
  id: string;
  type: "NEW_FOLLOWER" | "REVIEW_LIKE" | "REVIEW_COMMENT" | "LIST_LIKE" | "LIST_COMMENT";
  entityId: string | null;
  entityTitle: string | null;
  isRead: boolean;
  createdAt: string;
  actor: NotificationActor | null;
};

async function notifRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getStoredAccessToken();

  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers, cache: "no-store" });

  if (res.status === 401 && token) {
    const freshToken = await refreshStoredAuth();
    if (freshToken) {
      headers.set("Authorization", `Bearer ${freshToken}`);
      res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers, cache: "no-store" });
    }
  }

  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message ?? res.statusText);
  return data as T;
}

export async function getNotifications(params: { page?: number; limit?: number } = {}): Promise<{
  items: NotificationEntry[];
  unreadCount: number;
}> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const raw = await notifRequest<{ data?: NotificationEntry[]; unreadCount?: number }>(`/notifications?${qs}`);
  return {
    items: Array.isArray(raw.data) ? raw.data : [],
    unreadCount: raw.unreadCount ?? 0,
  };
}

export async function markNotificationsRead(): Promise<void> {
  await notifRequest<void>("/notifications/read", { method: "PUT" });
}

export function notifMessage(n: NotificationEntry): string {
  const actor = n.actor?.name ?? n.actor?.username ?? "Someone";
  switch (n.type) {
    case "NEW_FOLLOWER":
      return `${actor} started following you`;
    case "REVIEW_LIKE":
      return n.entityTitle ? `${actor} liked your review of ${n.entityTitle}` : `${actor} liked your review`;
    case "REVIEW_COMMENT":
      return n.entityTitle ? `${actor} commented on your review of ${n.entityTitle}` : `${actor} commented on your review`;
    case "LIST_LIKE":
      return n.entityTitle ? `${actor} liked your list "${n.entityTitle}"` : `${actor} liked your list`;
    case "LIST_COMMENT":
      return n.entityTitle ? `${actor} commented on your list "${n.entityTitle}"` : `${actor} commented on your list`;
    default:
      return `${actor} interacted with you`;
  }
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
