import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Author, Book } from "../components/Item";
import axios from "axios";
import { BASE_URL, ITEMS_PER_PAGE } from "../constants";
import { getStringParams, type StringParams } from "../utils/helper";

interface SearchState {
  loading: boolean;
  error: string | null;
  data: Book[] | Author[];
  numFound: number;
  searchTerm?: string;
}

interface Data {
  docs: Book[] | Author[];
  numFound: number;
}
interface SearchArgs {
  filter: string;
  search: string;
  page: number;
  mode: string;
}
export const fetchBookAndAuthor = createAsyncThunk(
  "search/bookandauthor",
  async ({ filter, search, page, mode }: SearchArgs) => {
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

    const offset = (page - 1) * ITEMS_PER_PAGE;

    const arrStringParams: StringParams[] = [
      {
        key: "offset",
        value: offset.toString(),
        setNew: true,
      },
      {
        key: "limit",
        value: ITEMS_PER_PAGE.toString(),
        setNew: true,
      },
    ];

    if (filterObj.author && filterObj.title) {
      arrStringParams.push({
        key: "title",
        value: filterObj.title,
        setNew: true,
      });

      arrStringParams.push({
        key: "author",
        value: filterObj.author,
        setNew: true,
      });
    } else {
      if (filter === "books") {
        arrStringParams.push({
          key: "title",
          value: search,
          setNew: true,
        });
      } else if (filter === "authors") {
        arrStringParams.push({
          key: "author",
          value: search,
          setNew: true,
        });
      }
    }
    arrStringParams.push({
      key: "mode",
      value: mode,
      setNew: true,
    });

    arrStringParams.push({
      key: "has_fulltext",
      value: "true",
      setNew: mode === "everything" ? false : true,
    });

    const params = getStringParams(arrStringParams);

    const url = `${BASE_URL}/search.json?${params}`;

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
  reducers: {},
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
