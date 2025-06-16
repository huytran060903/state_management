import authorReducer, {
  fetchAuthor,
  resetAuthor,
  type authorState,
} from "../fetures/authorInfiniteSearch";
import { store } from "../store/store";
import axios from "axios";
import { NUMBER_ITEM_IN_A_PAGE } from "../constants";
import type { Author } from "../components/Item";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Author Infinite Search Slice", () => {
  const initialState = {
    list: [],
    page: 1,
    loading: false,
    error: null,
    hasMore: false,
  };

  const mockAuthor: Author = {
    key: "1",
    author_name: ["Author 1"],
    language: ["eng"],
    first_publish_year: 2000,
    edition_count: 5,
    top_work: "Best Book",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return initial state", () => {
    expect(authorReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle resetAuthor", () => {
    const previousState: authorState = {
      list: [mockAuthor],
      page: 2,
      loading: false,
      error: null,
      hasMore: true,
    };

    expect(authorReducer(previousState, resetAuthor())).toEqual(initialState);
  });

  it("should handle fetchAuthor.pending", () => {
    const action = { type: fetchAuthor.pending.type };
    const state = authorReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("should handle fetchAuthor.fulfilled", () => {
    const previousState = {
      ...initialState,
      loading: true,
    };

    const mockAuthors = [
      { key: "1", name: "Author 1" },
      { key: "2", name: "Author 2" },
    ];

    const action = {
      type: fetchAuthor.fulfilled.type,
      payload: { data: mockAuthors, hasMore: true },
    };

    const state = authorReducer(previousState, action);

    expect(state.loading).toBe(false);
    expect(state.list).toEqual(mockAuthors);
    expect(state.page).toBe(2);
    expect(state.hasMore).toBe(true);
  });

  it("should handle fetchAuthor.rejected", () => {
    const previousState = {
      ...initialState,
      loading: true,
    };

    const action = {
      type: fetchAuthor.rejected.type,
      error: { message: "Failed to fetch authors" },
    };

    const state = authorReducer(previousState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Failed to fetch authors");
  });

  it("should fetch authors successfully", async () => {
    const mockResponse = {
      data: {
        docs: [
          { key: "1", name: "Author 1" },
          { key: "2", name: "Author 2" },
        ],
        numFound: 30,
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    await store.dispatch(fetchAuthor({ query: "test", page: 1 }));
    const state = store.getState().author;

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://openlibrary.org/search/authors.json?q=test&offset=0&limit=${NUMBER_ITEM_IN_A_PAGE}`
    );
    expect(state.list).toHaveLength(2);
    expect(state.hasMore).toBe(true);
    expect(state.loading).toBe(false);
  });

  it("should handle API errors", async () => {
    const errorMessage = "Network Error";
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(fetchAuthor({ query: "test", page: 1 }));
    const state = store.getState().author;

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it("should calculate hasMore correctly", async () => {
    const mockResponse = {
      data: {
        docs: [{ key: "1", name: "Author 1" }],
        numFound: NUMBER_ITEM_IN_A_PAGE, // Exactly one page worth of results
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    await store.dispatch(fetchAuthor({ query: "test", page: 1 }));
    const state = store.getState().author;

    expect(state.hasMore).toBe(false);
  });
});
