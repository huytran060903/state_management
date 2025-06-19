import { create } from "zustand";
import type { Author, Book } from "../components/Item";
import axios from "axios";
import { BASE_URL, ITEMS_PER_PAGE } from "../constants";
import { getStringParams, type StringParams } from "../utils/helper";

export interface SearchState {
  data: Author[] | Book[];
  numFound: number;
  loading: boolean;
  error: string | null;
  fetchData: (
    filter: string,
    search: string,
    page: number,
    mode: string
  ) => Promise<void>;
}

export const useSearchStore = create<SearchState>((set) => ({
  data: [],
  numFound: 0,
  loading: false,
  error: null,
  fetchData: async (filter, search, page, mode) => {
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
      set({ loading: true, error: null });
      const res = await axios.get(url);

      const { docs, numFound } = res.data;

      set({
        data: docs,
        numFound: numFound,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        error:
          error && typeof error === "object" && "message" in error
            ? (error as { message: string }).message
            : String(error),
        loading: false,
      });
    }
  },
}));
