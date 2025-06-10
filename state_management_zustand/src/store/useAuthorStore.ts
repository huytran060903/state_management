// stores/useAuthorStore.ts
import { create } from "zustand";
import axios from "axios";
import type { Author } from "../components/Item";

interface AuthorState {
  authors: Author[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  query: string;

  setQuery: (newQuery: string) => void;
  reset: () => void;
  fetchAuthors: () => Promise<void>;
}

const LIMIT = 10;

export const useAuthorStore = create<AuthorState>((set, get) => ({
  authors: [],
  page: 1,
  hasMore: true,
  loading: false,
  error: null,
  query: "",

  setQuery: (newQuery: string) => {
    set({ query: newQuery, page: 1, authors: [], hasMore: true });
  },

  reset: () => set({ authors: [], page: 1, hasMore: true, error: null }),

  fetchAuthors: async () => {
    const { page, query, hasMore, loading } = get();
    if (!hasMore || loading) return;

    set({ loading: true, error: null });

    try {
      const offset = (page - 1) * LIMIT;
      const res = await axios.get(
        `https://openlibrary.org/search/authors.json?q=${query}&limit=${LIMIT}&offset=${offset}`
      );

      const { docs, numFound } = res.data;
      set((state) => ({
        authors: [...state.authors, ...docs],
        hasMore: offset + LIMIT < numFound,
        page: state.page + 1,
        loading: false,
      }));
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
