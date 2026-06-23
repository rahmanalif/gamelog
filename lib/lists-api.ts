import { getStoredAccessToken, refreshStoredAuth } from "@/lib/auth-session";
import { fixImageUrl } from "@/lib/fix-image-url";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ListPrivacy = "PUBLIC" | "UNLISTED" | "PRIVATE";
export type ListSortOrder = "recent" | "trending" | "top_rated";

export type ListGamePreview = {
  game: { id: string; slug: string; coverUrl: string | null; title: string };
};

export type ListSummary = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  privacy: ListPrivacy;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  user: { id: string; profile: { username: string; name: string; avatarUrl: string | null } };
  _count: { items: number; likes: number };
  items: ListGamePreview[];
};

export type ListItem = {
  id: string;
  listId: string;
  gameId: string;
  position: number;
  note: string | null;
  createdAt: string;
  game: {
    id: string;
    title: string;
    slug: string;
    coverUrl: string | null;
    releaseDate: string | null;
    avgRating?: number | string | null;
    ratingCount?: number;
    likeCount?: number;
    logCount?: number;
  };
};

export type ListDetail = Omit<ListSummary, "items"> & {
  items: ListItem[];
  currentUser?: {
    isLiked: boolean;
  };
};

export type ListReview = {
  id: string;
  listId?: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  likeCount?: number;
  isLiked?: boolean;
  replies?: ListReview[];
  user: {
    id?: string;
    username: string;
    name?: string | null;
    avatarUrl?: string | null;
  };
};

export type CreateListReviewInput = {
  content: string;
};

export type CreateListInput = {
  title: string;
  description?: string;
  privacy?: ListPrivacy;
};

export type UpdateListInput = {
  title?: string;
  description?: string;
  privacy?: ListPrivacy;
  coverImageUrl?: string;
};

export type AddGameInput = {
  gameId: string;
  note?: string;
};

export type PaginatedLists = {
  items: ListSummary[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

// ─── Internals ────────────────────────────────────────────────────────────────

function buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }
  return url.toString();
}

function getError(data: unknown, fallback: string): string {
  if (typeof data === "object" && data !== null) {
    const r = data as Record<string, unknown>;
    const msg = r.message ?? r.error;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
  }
  return fallback || "Something went wrong.";
}

function unwrapEnvelope<T>(raw: unknown): T {
  if (typeof raw === "object" && raw !== null && "data" in raw) {
    return (raw as { data: T }).data;
  }
  return raw as T;
}

// Returns the raw response envelope (used for paginated calls where `data` + `pagination` are at top level)
async function listRequest<T>(
  path: string,
  init: RequestInit = {},
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getStoredAccessToken();
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res = await fetch(buildUrl(path, params), { ...init, headers, cache: "no-store" });
  if (res.status === 401 && token) {
    const freshToken = await refreshStoredAuth();
    if (freshToken) {
      headers.set("Authorization", `Bearer ${freshToken}`);
      res = await fetch(buildUrl(path, params), { ...init, headers, cache: "no-store" });
    }
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(getError(data, res.statusText));
  return data as T;
}

// Unwraps `{ success, message, statusCode, data: X }` → returns X (used for single-resource calls)
async function listResourceRequest<T>(
  path: string,
  init: RequestInit = {},
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const raw = await listRequest<unknown>(path, init, params);
  return unwrapEnvelope<T>(raw);
}

type BackendPaginated<T> = {
  data: T[];
  pagination: {
    mode: string;
    total?: number;
    page?: number;
    limit: number;
    totalPages?: number;
    hasNext: boolean;
  };
};

function normalizePaginated<T>(raw: unknown): { items: T[]; meta: PaginatedLists["meta"] } {
  const r = raw as BackendPaginated<T>;
  const items = Array.isArray(r.data) ? r.data : [];
  const p = r.pagination ?? ({} as BackendPaginated<T>["pagination"]);
  return {
    items,
    meta: {
      page: p.page ?? 1,
      limit: p.limit ?? items.length,
      total: p.total ?? items.length,
      totalPages: p.totalPages ?? 1,
    },
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getLists(params: {
  sort?: ListSortOrder;
  page?: number;
  limit?: number;
} = {}): Promise<PaginatedLists> {
  const raw = await listRequest<unknown>("/lists", {}, params as Record<string, string | number | undefined>);
  return normalizePaginated<ListSummary>(raw);
}

export async function getMyLists(params: { page?: number; limit?: number } = {}): Promise<PaginatedLists> {
  const raw = await listRequest<unknown>("/lists/mine", {}, params as Record<string, string | number | undefined>);
  return normalizePaginated<ListSummary>(raw);
}

export async function getUserLists(
  username: string,
  params: { page?: number; limit?: number } = {},
): Promise<PaginatedLists> {
  const raw = await listRequest<unknown>(
    `/users/${username}/lists`,
    {},
    params as Record<string, string | number | undefined>,
  );
  return normalizePaginated<ListSummary>(raw);
}

export async function getList(id: string): Promise<ListDetail> {
  return listResourceRequest<ListDetail>(`/lists/${id}`);
}

export async function createList(input: CreateListInput): Promise<ListDetail> {
  return listResourceRequest<ListDetail>("/lists", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateList(id: string, input: UpdateListInput): Promise<ListDetail> {
  return listResourceRequest<ListDetail>(`/lists/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteList(id: string): Promise<{ message: string }> {
  return listResourceRequest<{ message: string }>(`/lists/${id}`, { method: "DELETE" });
}

export async function addGameToList(listId: string, input: AddGameInput): Promise<unknown> {
  return listResourceRequest<unknown>(`/lists/${listId}/games`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function removeGameFromList(listId: string, gameId: string): Promise<unknown> {
  return listResourceRequest<unknown>(`/lists/${listId}/games/${gameId}`, { method: "DELETE" });
}

export async function likeList(id: string): Promise<{ isLiked: boolean; likeCount: number }> {
  return listResourceRequest<{ isLiked: boolean; likeCount: number }>(`/lists/${id}/like`, {
    method: "POST",
  });
}

export async function unlikeList(id: string): Promise<{ isLiked: boolean; likeCount: number }> {
  return listResourceRequest<{ isLiked: boolean; likeCount: number }>(`/lists/${id}/like`, {
    method: "DELETE",
  });
}

export async function likeListComment(commentId: string): Promise<{ isLiked: boolean; likeCount: number }> {
  return listResourceRequest<{ isLiked: boolean; likeCount: number }>(`/lists/comments/${commentId}/like`, {
    method: "POST",
  });
}

export async function unlikeListComment(commentId: string): Promise<{ isLiked: boolean; likeCount: number }> {
  return listResourceRequest<{ isLiked: boolean; likeCount: number }>(`/lists/comments/${commentId}/like`, {
    method: "DELETE",
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function listCoverImages(list: Pick<ListSummary, "items">, count = 4): string[] {
  return list.items
    .slice(0, count)
    .map((i) => fixImageUrl(i.game.coverUrl))
    .filter((url): url is string => Boolean(url));
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
