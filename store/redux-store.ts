"use client";

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { listsApi } from "@/store/lists-api.slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      [listsApi.reducerPath]: listsApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(listsApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export function setupStoreListeners(store: AppStore) {
  setupListeners(store.dispatch);
}
