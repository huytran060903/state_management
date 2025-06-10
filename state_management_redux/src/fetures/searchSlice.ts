import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Author, Book } from "../components/Item";
import axios from "axios";
import { NUMBER_ITEM_IN_A_PAGE } from "../constants";

interface SearchState {
  loading: boolean;
  error: string | null;
  data: Book[] | Author[];
  numFound: number;
}

interface Data {
  docs: Book[] | Author[];
  numFound: number;
}
interface SearchArgs {
  filter: string;
  search: string;
  page: number;
}
export const fetchBookAndAuthor = createAsyncThunk(
  "search/bookandauthor",
  async ({ filter, search, page }: SearchArgs) => {
    const filterObj: { title: string; author: string } = {
      title: "",
      author: "",
    };

    search.split(" ").forEach((pair) => {
      const [key, value] = pair.split(":");
      if (key === "title" || key === "author") {
        filterObj[key] = value;
      }
    });

    let url = "https://openlibrary.org/search.json?";
    const offset = (page - 1) * NUMBER_ITEM_IN_A_PAGE;

    if (filterObj.author && filterObj.title) {
      url += `title=${filterObj.title}&offset=${offset}&limit=${NUMBER_ITEM_IN_A_PAGE}&author=${filterObj.author}`;
    } else {
      if (filter === "books") {
        url += `title=${search}&offset=${offset}&limit=${NUMBER_ITEM_IN_A_PAGE}`;
      } else if (filter === "authors") {
        url += `author=${search}&offset=${offset}&limit=${NUMBER_ITEM_IN_A_PAGE}`;
      }
    }

    try {
      const res = await axios.get(url);

      const { docs, numFound } = res.data as Data;

      return { docs, numFound };
    } catch (error) {
      console.error(error);
      throw new Error("Fetch failed");
    }
  }
);

const initialState: SearchState = {
  loading: false,
  error: null,
  data: [],
  numFound: 0,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
   
  },
  extraReducers(builder) {
    builder.addCase(fetchBookAndAuthor.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchBookAndAuthor.fulfilled,
      (
        state,
        action: PayloadAction<{ docs: Book[] | Author[]; numFound: number }>
      ) => {
        state.loading = false;
        state.data = action.payload.docs;
        state.numFound = action.payload.numFound;
      }
    );
    builder.addCase(fetchBookAndAuthor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Error fetching data";
    });
  },
});

export default searchSlice.reducer;
