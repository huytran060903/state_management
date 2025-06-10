import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "../fetures/searchSlice";
import authorInfiniteSearchSlice from "../fetures/authorInfiniteSearch";
export const store = configureStore({
  reducer: {
    search: searchReducer,
    author: authorInfiniteSearchSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
