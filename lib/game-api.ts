import { getStoredAccessToken, refreshStoredAuth } from "@/lib/auth-session";

export type GameSummary = {
  id: string | number;
  rawgId?: number;
  title: string;
  slug: string;
  coverImage?: string | null;
  backdropImage?: string | null;
  releaseDate?: string | null;
  genres?: string[];
  platforms?: string[];
  rawgRating?: number | null;
  averageRating?: number | null;
  ratingCount?: number;
  reviewCount?: number;
  views?: number;
  likes?: number;
};

export type GameMetaItem = {
  id: string | number;
  name: string;
  slug: string;
};

export type GameDetail = Omit<GameSummary, "genres" | "platforms"> & {
  description?: string | null;
  developer?: string | null;
  publisher?: string | null;
  images?: string[];
  logCount?: number;
  viewCount?: number;
  likeCount?: number;
  watchlistCount?: number;
  genres?: GameMetaItem[];
  platforms?: GameMetaItem[];
  currentUser?: {
    hasLogged: boolean;
    latestLogId?: string;
    rating?: number;
    isLiked: boolean;
    isInWatchlist: boolean;
  };
};

export type GameReview = {
  id: string;
  rating?: number | null;
  reviewText?: string | null;
  playedAt?: string | null;
  finished?: boolean;
  containsSpoilers?: boolean;
  likesCount?: number;
  isLiked?: boolean;
  commentsCount?: number;
  createdAt?: string;
  user: {
    id?: string;
    username: string;
    avatar?: string | null;
  };
};

export type Paginated<T> = {
  items: T[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type BackendPagination = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

export type GameFilters = {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  platform?: string;
  sort?: string;
  orderBy?: "metacriticScore" | "avgRating" | "releaseDate" | "title";
  order?: "asc" | "desc";
};

export type LogGameInput = {
  rating?: number;
  reviewText?: string;
  playedAt: string;
  platformId?: string | number;
  platformName?: string;
  finished?: boolean;
  containsSpoilers?: boolean;
};

import { fixImageUrl } from "@/lib/fix-image-url";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  statusCode?: number;
  data?: T;
};

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });
  return url.toString();
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

function unwrapData<T>(data: unknown): T {
  if (typeof data === "object" && data !== null && "data" in data) {
    return (data as ApiEnvelope<T>).data as T;
  }

  return data as T;
}

function normalizeItems<T>(data: unknown): Paginated<T> {
  const envelope = data as { 
    data?: unknown; 
    pagination?: BackendPagination; 
    meta?: BackendPagination;
    total?: number;
    limit?: number;
    page?: number;
    totalPages?: number;
  };
  const unwrapped = unwrapData<unknown>(data);

  let items: T[] = [];
  if (Array.isArray(unwrapped)) {
    items = unwrapped as T[];
  } else if (typeof unwrapped === "object" && unwrapped !== null) {
    const record = unwrapped as Record<string, unknown>;
    items = Array.isArray(record.items)
      ? (record.items as T[])
      : Array.isArray(record.data)
        ? (record.data as T[])
        : [];
  }

  // Check nested keys first, then root
  const pagination = envelope.pagination ?? envelope.meta ?? envelope;
  const total = Number(pagination?.total ?? (envelope as any).total ?? items.length);
  const limit = Number(pagination?.limit ?? (envelope as any).limit ?? items.length);
  const page = Number(pagination?.page ?? (envelope as any).page ?? 1);
  const totalPages = Number(pagination?.totalPages ?? (envelope as any).totalPages ?? (Math.ceil(total / limit) || 1));

  const meta = {
    page,
    limit,
    total,
    totalPages,
  };

  return { items, meta };
}

function getNestedMetaItems(value: unknown, key: "genre" | "platform" | "company"): GameMetaItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item !== "object" || item === null) return null;
      const record = item as Record<string, unknown>;
      const nested = record[key] ?? record;
      if (typeof nested !== "object" || nested === null) return null;
      const nestedRecord = nested as Record<string, unknown>;
      if (!nestedRecord.id && !nestedRecord.slug) return null;

      return {
        id: (nestedRecord.id ?? nestedRecord.slug) as string | number,
        name: String(nestedRecord.name ?? ""),
        slug: String(nestedRecord.slug ?? ""),
      };
    })
    .filter((item): item is GameMetaItem => Boolean(item?.name && item.slug));
}

function getFirstCompanyName(value: unknown): string | null {
  return getNestedMetaItems(value, "company")[0]?.name ?? null;
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const parsed = toNumber(value, Number.NaN);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeGameSummary(game: unknown): GameSummary {
  const record = game as Record<string, unknown>;
  const metacriticScore = toNullableNumber(record.metacriticScore);

  return {
    id: (record.id ?? record.rawgId ?? record.slug) as string | number,
    rawgId: typeof record.rawgId === "number" ? record.rawgId : undefined,
    title: String(record.title ?? record.name ?? ""),
    slug: String(record.slug ?? ""),
    coverImage: fixImageUrl((record.coverImage ?? record.coverUrl ?? null) as string | null),
    backdropImage: fixImageUrl((record.backdropImage ?? record.backdropUrl ?? null) as string | null),
    releaseDate: (record.releaseDate ?? null) as string | null,
    genres: getNestedMetaItems(record.genres, "genre").map((genre) => genre.name),
    platforms: getNestedMetaItems(record.platforms, "platform").map((platform) => platform.name),
    rawgRating: metacriticScore === null ? null : metacriticScore / 20,
    averageRating: toNullableNumber(record.averageRating ?? record.avgRating),
    ratingCount: toNumber(record.ratingCount),
    reviewCount: toNumber(record.reviewCount ?? record.logCount),
    views: toNumber(record.views ?? record.viewCount ?? record.logCount),
    likes: toNumber(record.likes ?? record.likeCount),
  };
}

function normalizeGameDetail(game: unknown): GameDetail {
  const record = game as Record<string, unknown>;
  const summary = normalizeGameSummary(game);

  return {
    ...summary,
    description: (record.description ?? null) as string | null,
    developer: (record.developer ?? getFirstCompanyName(record.developers)) as string | null,
    publisher: (record.publisher ?? getFirstCompanyName(record.publishers)) as string | null,
    images: Array.isArray(record.images) ? (record.images as string[]).map((u) => fixImageUrl(u) ?? u) : [],
    logCount: toNumber(record.logCount),
    viewCount: toNumber(record.viewCount ?? record.logCount),
    likeCount: toNumber(record.likeCount),
    watchlistCount: toNumber(record.watchlistCount),
    genres: getNestedMetaItems(record.genres, "genre"),
    platforms: getNestedMetaItems(record.platforms, "platform"),
    currentUser: record.currentUser as GameDetail["currentUser"],
  };
}

function normalizeGameReview(review: unknown): GameReview {
  const record = review as Record<string, unknown>;
  const user = (record.user ?? {}) as Record<string, unknown>;
  const profile = (user.profile ?? {}) as Record<string, unknown>;

  return {
    id: String(record.id ?? ""),
    rating: toNullableNumber(record.rating),
    reviewText: (record.reviewText ?? record.review ?? null) as string | null,
    playedAt: (record.playedAt ?? null) as string | null,
    finished: Boolean(record.finished),
    containsSpoilers: Boolean(record.containsSpoilers),
    likesCount: toNumber(record.likesCount ?? record.likeCount),
    isLiked: Boolean(record.isLiked),
    commentsCount: toNumber(record.commentsCount ?? record.commentCount),
    createdAt: (record.createdAt ?? null) as string | undefined,
    user: {
      id: typeof user.id === "string" ? user.id : undefined,
      username: String(profile.username ?? profile.name ?? user.username ?? user.name ?? "Player"),
      avatar: (profile.avatarUrl ?? profile.avatar ?? user.avatarUrl ?? user.avatar ?? null) as string | null,
    },
  };
}

function mapSort(filters: GameFilters) {
  if (filters.orderBy || filters.order) {
    return { orderBy: filters.orderBy, order: filters.order };
  }

  switch (filters.sort) {
    case "highest-rated":
      return { orderBy: "avgRating", order: "desc" };
    case "newest":
      return { orderBy: "releaseDate", order: "desc" };
    case "alphabetical":
      return { orderBy: "title", order: "asc" };
    case "most-reviewed":
      return { orderBy: "ratingCount", order: "desc" };
    default:
      return { orderBy: "metacriticScore", order: "desc" };
  }
}

async function gameRequest<T>(
  path: string,
  init: RequestInit = {},
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getStoredAccessToken();

  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);

  let response = await fetch(buildUrl(path, params), {
    ...init,
    headers,
    cache: "no-store",
  });
  if (response.status === 401 && token) {
    const freshToken = await refreshStoredAuth();
    if (freshToken) {
      headers.set("Authorization", `Bearer ${freshToken}`);
      response = await fetch(buildUrl(path, params), {
        ...init,
        headers,
        cache: "no-store",
      });
    }
  }
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(getErrorMessage(data, response.statusText));
  }

  return unwrapData<T>(data);
}

async function gameEnvelopeRequest(
  path: string,
  init: RequestInit = {},
  params?: Record<string, string | number | undefined>,
): Promise<unknown> {
  const headers = new Headers(init.headers);
  const token = getStoredAccessToken();

  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);

  let response = await fetch(buildUrl(path, params), {
    ...init,
    headers,
    cache: "no-store",
  });
  if (response.status === 401 && token) {
    const freshToken = await refreshStoredAuth();
    if (freshToken) {
      headers.set("Authorization", `Bearer ${freshToken}`);
      response = await fetch(buildUrl(path, params), {
        ...init,
        headers,
        cache: "no-store",
      });
    }
  }
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(getErrorMessage(data, response.statusText));
  }

  return data;
}

export async function getGames(filters: GameFilters = {}) {
  const { sort, ...rest } = filters;
  const sortParams = mapSort(filters);
  const params = {
    ...rest,
    orderBy: sortParams.orderBy === "ratingCount" ? "avgRating" : sortParams.orderBy,
    order: sortParams.order,
  };
  const data = await gameEnvelopeRequest("/games", {}, params);
  const normalized = normalizeItems<unknown>(data);
  return {
    ...normalized,
    items: normalized.items.map(normalizeGameSummary),
  };
}

export async function getPopularGames(limit = 12, period: "week" | "month" = "week") {
  void period;
  return getGames({ limit, orderBy: "metacriticScore", order: "desc" });
}

export async function searchGames(q: string) {
  if (!q.trim()) return Promise.resolve({ items: [] as GameSummary[] });
  return getGames({ search: q, limit: 6 });
}

export async function getGame(slug: string) {
  const data = await gameRequest<unknown>(`/games/${slug}`);
  return normalizeGameDetail(data);
}

export type RecentReview = GameReview & {
  game: {
    id: string;
    title: string;
    slug: string;
    coverUrl?: string | null;
    releaseDate?: string | null;
  };
};

export async function getRecentReviews(limit = 6, page = 1): Promise<RecentReview[]> {
  const data = await gameRequest<unknown>('/games/reviews/recent', {}, { limit, page });
  const items = Array.isArray(data) ? data : [];
  return items.map((item) => {
    const record = item as Record<string, unknown>;
    const gameRecord = (record.game ?? {}) as Record<string, unknown>;
    return {
      ...normalizeGameReview(item),
      game: {
        id: String(gameRecord.id ?? ''),
        title: String(gameRecord.title ?? ''),
        slug: String(gameRecord.slug ?? ''),
        coverUrl: fixImageUrl((gameRecord.coverUrl ?? null) as string | null),
        releaseDate: (gameRecord.releaseDate ?? null) as string | null,
      },
    };
  });
}

export async function getGameReviews(
  gameId: string | number,
  params: { page?: number; limit?: number; sort?: string } = {},
) {
  const data = await gameRequest<unknown>(`/games/${gameId}/reviews`, {}, params);
  const normalized = normalizeItems<unknown>(data);
  return {
    ...normalized,
    items: normalized.items.map(normalizeGameReview),
  };
}

export function logGame(gameId: string | number, data: LogGameInput) {
  return gameRequest<{ message: string; log: unknown }>(`/games/${gameId}/logs`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function likeGame(gameId: string | number) {
  return gameRequest<{ message: string; isLiked: boolean; likeCount: number }>(
    `/games/${gameId}/like`,
    { method: "POST" },
  );
}

export function unlikeGame(gameId: string | number) {
  return gameRequest<{ message: string; isLiked: boolean; likeCount: number }>(
    `/games/${gameId}/like`,
    { method: "DELETE" },
  );
}

export function likeReview(reviewId: string) {
  return gameRequest<{ message: string; isLiked: boolean; likeCount: number }>(
    `/games/reviews/${reviewId}/like`,
    { method: "POST" },
  );
}

export function unlikeReview(reviewId: string) {
  return gameRequest<{ message: string; isLiked: boolean; likeCount: number }>(
    `/games/reviews/${reviewId}/like`,
    { method: "DELETE" },
  );
}

export function addToWatchlist(gameId: string | number) {
  return gameRequest<{ message: string; isInWatchlist: boolean; watchlistCount: number }>(
    `/games/${gameId}/watchlist`,
    { method: "POST" },
  );
}

export function removeFromWatchlist(gameId: string | number) {
  return gameRequest<{ message: string; isInWatchlist: boolean; watchlistCount: number }>(
    `/games/${gameId}/watchlist`,
    { method: "DELETE" },
  );
}

export async function getGenres() {
  const data = await gameEnvelopeRequest("/genres");
  return normalizeItems<GameMetaItem>(data);
}

export async function getPlatforms() {
  const data = await gameEnvelopeRequest("/platforms");
  return normalizeItems<GameMetaItem>(data);
}
