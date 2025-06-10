import { create } from "zustand";
import type { Author, Book } from "../components/Item";
import axios from "axios";
import { NUMBER_ITEM_IN_A_PAGE } from "../constants";

export interface SearchState {
  data: Author[] | Book[];
  numFound: number;
  loading: boolean;
  error: string | null;
  fetchData: (filter: string, search: string, page: number) => Promise<void>;
}

export const useSearchStore = create<SearchState>((set) => ({
  data: [],
  numFound: 0,
  loading: false,
  error: null,
  fetchData: async (filter, search, page) => {
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
    set({ loading: true, error: null });
    try {
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
