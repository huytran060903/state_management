import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Author } from "../components/Item";
import axios from "axios";
import { NUMBER_ITEM_IN_A_PAGE } from "../constants";

export interface authorState {
  list: Author[];
  page: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

const initialState: authorState = {
  list: [],
  page: 1,
  loading: false,
  error: null,
  hasMore: false,
};
interface FetchAuthorArgs {
  query?: string;
  page: number;
}
export const fetchAuthor = createAsyncThunk(
  "author/fetch",
  async ({ query = "*", page }: FetchAuthorArgs) => {
    const res = await axios.get(
      `https://openlibrary.org/search/authors.json?q=${query}&offset=${
        (page - 1) * NUMBER_ITEM_IN_A_PAGE
      }&limit=${NUMBER_ITEM_IN_A_PAGE}`
    );

    const { docs, numFound } = res.data;

    return {
      data: docs as Author[],
      hasMore:
        (page - 1) * NUMBER_ITEM_IN_A_PAGE + NUMBER_ITEM_IN_A_PAGE < numFound,
    };
  }
);

const authorInfiniteSearchSlice = createSlice({
  name: "authors",
  initialState,
  reducers: {
    resetAuthor: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAuthor.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAuthor.fulfilled,
        (
          state,
          action: PayloadAction<{ data: Author[]; hasMore: boolean }>
        ) => {
          state.loading = false;
          state.page += 1;
          state.list = [...state.list, ...action.payload.data];
          state.hasMore = action.payload.hasMore;
        }
      )
      .addCase(fetchAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch";
      });
  },
});
export const { resetAuthor } = authorInfiniteSearchSlice.actions;
export default authorInfiniteSearchSlice.reducer;
