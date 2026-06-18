import { getStoredAccessToken, refreshStoredAuth } from "@/lib/auth-session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

export type UserProfile = {
  id: string;
  username: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  website: string | null;
  twitter: string | null;
  discord: string | null;
  followersCount: number;
  followingCount: number;
  gamesCount: number;
  reviewsCount: number;
  isFollowing: boolean | null;
};

export type UpdateProfileInput = {
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  discord?: string;
};

export type UserSummary = {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  followersCount: number;
  followingCount: number;
  reviewsCount: number;
  gamesCount: number;
  recentGameCovers: string[];
};

export type PaginatedUsers = {
  items: UserSummary[];
  total: number;
  hasNext: boolean;
};

export type UserSortBy = "followers" | "reviews" | "games";

export type FollowItem = {
  createdAt: string;
  following?: { id: string; profile: { username: string; name: string | null; avatarUrl: string | null } };
  follower?: { id: string; profile: { username: string; name: string | null; avatarUrl: string | null } };
};

export type PaginatedFollowResult = {
  items: FollowItem[];
  total: number;
  hasNext: boolean;
};

function getError(data: unknown, fallback: string): string {
  if (typeof data === "object" && data !== null) {
    const r = data as Record<string, unknown>;
    const msg = r.message ?? r.error;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
  }
  return fallback || "Something went wrong.";
}

async function peopleRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
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
  if (!res.ok) throw new Error(getError(data, res.statusText));

  return data as T;
}

function unwrap<T>(raw: unknown): T {
  if (typeof raw === "object" && raw !== null && "data" in raw) {
    return (raw as { data: T }).data;
  }
  return raw as T;
}

function normalizePaginated(raw: unknown): PaginatedFollowResult {
  const r = raw as { data?: FollowItem[]; pagination?: { total?: number; hasNext?: boolean } };
  const items = Array.isArray(r.data) ? r.data : [];
  return {
    items,
    total: r.pagination?.total ?? items.length,
    hasNext: r.pagination?.hasNext ?? false,
  };
}

export async function listUsers(params: {
  sort?: UserSortBy;
  page?: number;
  limit?: number;
} = {}): Promise<PaginatedUsers> {
  const qs = new URLSearchParams();
  if (params.sort) qs.set("sort", params.sort);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const raw = await peopleRequest<unknown>(`/users?${qs}`);
  const r = raw as { data?: UserSummary[]; pagination?: { total?: number; hasNext?: boolean } };
  return {
    items: Array.isArray(r.data) ? r.data : [],
    total: r.pagination?.total ?? 0,
    hasNext: r.pagination?.hasNext ?? false,
  };
}

export async function getProfile(username: string): Promise<UserProfile> {
  const raw = await peopleRequest<unknown>(`/users/${username}`);
  return unwrap<UserProfile>(raw);
}

export async function updateProfile(data: UpdateProfileInput): Promise<UserProfile> {
  const raw = await peopleRequest<unknown>('/users/me/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return unwrap<UserProfile>(raw);
}

export async function followUser(username: string): Promise<void> {
  await peopleRequest<void>(`/users/${username}/follow`, { method: "POST" });
}

export async function unfollowUser(username: string): Promise<void> {
  await peopleRequest<void>(`/users/${username}/follow`, { method: "DELETE" });
}

export async function getFollowing(
  username: string,
  params: { page?: number; limit?: number } = {},
): Promise<PaginatedFollowResult> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const raw = await peopleRequest<unknown>(`/users/${username}/following?${qs}`);
  return normalizePaginated(raw);
}

export async function getFollowers(
  username: string,
  params: { page?: number; limit?: number } = {},
): Promise<PaginatedFollowResult> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const raw = await peopleRequest<unknown>(`/users/${username}/followers?${qs}`);
  return normalizePaginated(raw);
}

export type GameLogEntry = {
  id: string;
  playedAt: string;
  rating: string | null;
  finished: boolean;
  game: { id: string; title: string; slug: string; coverUrl: string | null };
};

export type PaginatedGameLogs = {
  items: GameLogEntry[];
  hasNext: boolean;
};

export type FavoriteGameEntry = {
  position: number;
  game: { id: string; title: string; slug: string; coverUrl: string | null; avgRating: number; likeCount: number; logCount: number };
};

export async function getFavoriteGames(username: string): Promise<FavoriteGameEntry[]> {
  const raw = await peopleRequest<unknown>(`/users/${username}/favorites`);
  const data = unwrap<unknown>(raw);
  return Array.isArray(data) ? (data as FavoriteGameEntry[]) : [];
}

export async function setFavoriteGames(gameIds: string[]): Promise<void> {
  await peopleRequest<void>('/users/me/favorites', {
    method: 'PUT',
    body: JSON.stringify({ gameIds }),
  });
}

export async function getUserGameLogs(
  username: string,
  params: { limit?: number; orderBy?: "playedAt" | "rating" | "createdAt"; order?: "asc" | "desc" } = {},
): Promise<PaginatedGameLogs> {
  const qs = new URLSearchParams();
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.orderBy) qs.set("orderBy", params.orderBy);
  if (params.order) qs.set("order", params.order);
  const raw = await peopleRequest<unknown>(`/users/${username}/games?${qs}`);
  const r = raw as { data?: GameLogEntry[]; pagination?: { hasNext?: boolean } };
  return {
    items: Array.isArray(r.data) ? r.data : [],
    hasNext: r.pagination?.hasNext ?? false,
  };
}

export type WatchlistEntry = {
  createdAt: string;
  game: { id: string; title: string; slug: string; coverUrl: string | null };
};

export type ReviewEntry = {
  id: string;
  rating: string | null;
  body: string | null;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  game: { id: string; title: string; slug: string; coverUrl: string | null };
};

export async function getUserWatchlist(
  username: string,
  params: { limit?: number } = {},
): Promise<{ items: WatchlistEntry[]; total: number }> {
  const qs = new URLSearchParams();
  if (params.limit) qs.set("limit", String(params.limit));
  const raw = await peopleRequest<unknown>(`/users/${username}/watchlist?${qs}`);
  const r = raw as { data?: WatchlistEntry[]; pagination?: { total?: number } };
  return {
    items: Array.isArray(r.data) ? r.data : [],
    total: r.pagination?.total ?? 0,
  };
}

export async function getUserReviews(
  username: string,
  params: { limit?: number } = {},
): Promise<ReviewEntry[]> {
  const qs = new URLSearchParams();
  if (params.limit) qs.set("limit", String(params.limit));
  const raw = await peopleRequest<unknown>(`/users/${username}/reviews?${qs}`);
  const r = raw as { data?: ReviewEntry[] };
  return Array.isArray(r.data) ? r.data : [];
}

export type LikedGameEntry = {
  createdAt: string;
  game: { id: string; title: string; slug: string; coverUrl: string | null; avgRating: number; likeCount: number; logCount: number };
};

export async function getUserLikedGames(
  username: string,
  params: { page?: number; limit?: number } = {},
): Promise<{ items: LikedGameEntry[]; total: number; hasNext: boolean }> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const raw = await peopleRequest<unknown>(`/users/${username}/liked-games?${qs}`);
  const r = raw as { data?: LikedGameEntry[]; pagination?: { total?: number; hasNext?: boolean } };
  return {
    items: Array.isArray(r.data) ? r.data : [],
    total: r.pagination?.total ?? 0,
    hasNext: r.pagination?.hasNext ?? false,
  };
}
