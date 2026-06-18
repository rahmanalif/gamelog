"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { getStoredAccessToken, refreshStoredAuth } from "@/lib/auth-session";
import type {
  AddGameInput,
  CreateListReviewInput,
  CreateListInput,
  ListDetail,
  ListReview,
  ListSortOrder,
  ListSummary,
  PaginatedLists,
  UpdateListInput,
} from "@/lib/lists-api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

type BackendEnvelope<T> = {
  success?: boolean;
  message?: string;
  statusCode?: number;
  data: T;
};

type BackendPaginated<T> = {
  data: T[];
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

function unwrapEnvelope<T>(raw: unknown): T {
  if (typeof raw === "object" && raw !== null && "data" in raw) {
    return (raw as BackendEnvelope<T>).data;
  }
  return raw as T;
}

function normalizePaginated<T>(raw: unknown): PaginatedLists {
  const envelopeData = unwrapEnvelope<BackendPaginated<T> | T[]>(raw);
  const payload = Array.isArray(envelopeData)
    ? ({ data: envelopeData } as BackendPaginated<T>)
    : envelopeData;
  const items = Array.isArray(payload.data) ? payload.data : [];
  const pagination = payload.pagination;

  return {
    items: items as ListSummary[],
    meta: {
      page: pagination?.page ?? 1,
      limit: pagination?.limit ?? items.length,
      total: pagination?.total ?? items.length,
      totalPages: pagination?.totalPages ?? 1,
    },
  };
}

function normalizeListReviews(raw: unknown): ListReview[] {
  const data = unwrapEnvelope<unknown>(raw);
  const items = Array.isArray(data)
    ? data
    : typeof data === "object" && data !== null
      ? ((data as Record<string, unknown>).items ?? (data as Record<string, unknown>).data)
      : [];

  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    const record = item as Record<string, unknown>;
    const user = (record.user ?? {}) as Record<string, unknown>;
    const profile = (user.profile ?? {}) as Record<string, unknown>;

    return {
      id: String(record.id ?? ""),
      listId: typeof record.listId === "string" ? record.listId : undefined,
      content: String(record.content ?? record.reviewText ?? record.comment ?? record.body ?? ""),
      createdAt: (record.createdAt ?? null) as string | undefined,
      updatedAt: (record.updatedAt ?? null) as string | undefined,
      likeCount: Number(record.likeCount ?? record.likesCount ?? 0),
      isLiked: Boolean(record.isLiked),
      user: {
        id: typeof user.id === "string" ? user.id : undefined,
        username: String(profile.username ?? user.username ?? profile.name ?? user.name ?? "Player"),
        name: (profile.name ?? user.name ?? null) as string | null,
        avatarUrl: (profile.avatarUrl ?? user.avatarUrl ?? profile.avatar ?? user.avatar ?? null) as string | null,
      },
    };
  });
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getStoredAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithRefresh: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const token = await refreshStoredAuth();
    if (token) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const listsApi = createApi({
  reducerPath: "listsApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["List", "Lists", "MyLists", "ListReviews"],
  endpoints: (builder) => ({
    getLists: builder.query<PaginatedLists, { sort?: ListSortOrder; page?: number; limit?: number } | void>({
      query: (params) => ({ url: "/lists", params: params ?? undefined }),
      transformResponse: (raw: unknown) => normalizePaginated<ListSummary>(raw),
      providesTags: (result) => [
        { type: "Lists", id: "PUBLIC" },
        ...(result?.items.map((list) => ({ type: "List" as const, id: list.id })) ?? []),
      ],
    }),
    getMyLists: builder.query<PaginatedLists, { page?: number; limit?: number } | void>({
      query: (params) => ({ url: "/lists/mine", params: params ?? undefined }),
      transformResponse: (raw: unknown) => normalizePaginated<ListSummary>(raw),
      providesTags: (result) => [
        { type: "MyLists", id: "CURRENT" },
        ...(result?.items.map((list) => ({ type: "List" as const, id: list.id })) ?? []),
      ],
    }),
    getList: builder.query<ListDetail, string>({
      query: (id) => `/lists/${id}`,
      transformResponse: (raw: unknown) => unwrapEnvelope<ListDetail>(raw),
      providesTags: (_result, _error, id) => [{ type: "List", id }],
    }),
    createList: builder.mutation<ListDetail, CreateListInput>({
      query: (body) => ({ url: "/lists", method: "POST", body }),
      transformResponse: (raw: unknown) => unwrapEnvelope<ListDetail>(raw),
      invalidatesTags: [
        { type: "Lists", id: "PUBLIC" },
        { type: "MyLists", id: "CURRENT" },
      ],
    }),
    updateList: builder.mutation<ListDetail, { id: string; input: UpdateListInput }>({
      query: ({ id, input }) => ({ url: `/lists/${id}`, method: "PUT", body: input }),
      transformResponse: (raw: unknown) => unwrapEnvelope<ListDetail>(raw),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "List", id },
        { type: "Lists", id: "PUBLIC" },
        { type: "MyLists", id: "CURRENT" },
      ],
    }),
    deleteList: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/lists/${id}`, method: "DELETE" }),
      transformResponse: (raw: unknown) => unwrapEnvelope<{ message: string }>(raw),
      invalidatesTags: (_result, _error, id) => [
        { type: "List", id },
        { type: "Lists", id: "PUBLIC" },
        { type: "MyLists", id: "CURRENT" },
      ],
    }),
    addGameToList: builder.mutation<unknown, { listId: string; input: AddGameInput }>({
      query: ({ listId, input }) => ({ url: `/lists/${listId}/games`, method: "POST", body: input }),
      transformResponse: (raw: unknown) => unwrapEnvelope<unknown>(raw),
      invalidatesTags: (_result, _error, { listId }) => [
        { type: "List", id: listId },
        { type: "Lists", id: "PUBLIC" },
        { type: "MyLists", id: "CURRENT" },
      ],
    }),
    removeGameFromList: builder.mutation<unknown, { listId: string; gameId: string }>({
      query: ({ listId, gameId }) => ({ url: `/lists/${listId}/games/${gameId}`, method: "DELETE" }),
      transformResponse: (raw: unknown) => unwrapEnvelope<unknown>(raw),
      invalidatesTags: (_result, _error, { listId }) => [
        { type: "List", id: listId },
        { type: "Lists", id: "PUBLIC" },
        { type: "MyLists", id: "CURRENT" },
      ],
    }),
    getListReviews: builder.query<ListReview[], string>({
      query: (id) => `/lists/${id}/comments`,
      transformResponse: (raw: unknown) => normalizeListReviews(raw),
      providesTags: (_result, _error, id) => [{ type: "ListReviews", id }],
    }),
    createListReview: builder.mutation<ListReview, { listId: string; input: CreateListReviewInput }>({
      query: ({ listId, input }) => ({
        url: `/lists/${listId}/comments`,
        method: "POST",
        body: input,
      }),
      transformResponse: (raw: unknown) => normalizeListReviews([unwrapEnvelope<unknown>(raw)])[0],
      invalidatesTags: (_result, _error, { listId }) => [
        { type: "ListReviews", id: listId },
        { type: "List", id: listId },
        { type: "Lists", id: "PUBLIC" },
      ],
    }),
    likeList: builder.mutation<{ isLiked: boolean; likeCount: number }, string>({
      query: (id) => ({ url: `/lists/${id}/like`, method: "POST" }),
      transformResponse: (raw: unknown) => unwrapEnvelope<{ isLiked: boolean; likeCount: number }>(raw),
      invalidatesTags: (_result, _error, id) => [
        { type: "List", id },
        { type: "Lists", id: "PUBLIC" },
      ],
    }),
    unlikeList: builder.mutation<{ isLiked: boolean; likeCount: number }, string>({
      query: (id) => ({ url: `/lists/${id}/like`, method: "DELETE" }),
      transformResponse: (raw: unknown) => unwrapEnvelope<{ isLiked: boolean; likeCount: number }>(raw),
      invalidatesTags: (_result, _error, id) => [
        { type: "List", id },
        { type: "Lists", id: "PUBLIC" },
      ],
    }),
    likeListComment: builder.mutation<{ isLiked: boolean; likeCount: number }, { listId: string; commentId: string }>({
      query: ({ commentId }) => ({ url: `/lists/comments/${commentId}/like`, method: "POST" }),
      transformResponse: (raw: unknown) => unwrapEnvelope<{ isLiked: boolean; likeCount: number }>(raw),
      invalidatesTags: (_result, _error, { listId }) => [{ type: "ListReviews", id: listId }],
    }),
    unlikeListComment: builder.mutation<{ isLiked: boolean; likeCount: number }, { listId: string; commentId: string }>({
      query: ({ commentId }) => ({ url: `/lists/comments/${commentId}/like`, method: "DELETE" }),
      transformResponse: (raw: unknown) => unwrapEnvelope<{ isLiked: boolean; likeCount: number }>(raw),
      invalidatesTags: (_result, _error, { listId }) => [{ type: "ListReviews", id: listId }],
    }),
  }),
});

export const {
  useAddGameToListMutation,
  useCreateListMutation,
  useCreateListReviewMutation,
  useDeleteListMutation,
  useGetListQuery,
  useGetListReviewsQuery,
  useGetListsQuery,
  useGetMyListsQuery,
  useLikeListMutation,
  useLikeListCommentMutation,
  useRemoveGameFromListMutation,
  useUnlikeListMutation,
  useUnlikeListCommentMutation,
  useUpdateListMutation,
} = listsApi;
