import { useAuthorStore } from "../store/useAuthorStore";
import axios from "axios";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useAuthorStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthorStore.getState().reset();
    jest.clearAllMocks();
  });

  it("should initialize with default values", () => {
    const state = useAuthorStore.getState();
    expect(state.authors).toEqual([]);
    expect(state.page).toBe(1);
    expect(state.hasMore).toBe(true);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.query).toBe("");
  });

  it("should update query and reset related states", () => {
    const store = useAuthorStore.getState();
    store.setQuery("test query");

    const newState = useAuthorStore.getState();
    expect(newState.query).toBe("test query");
    expect(newState.page).toBe(1);
    expect(newState.authors).toEqual([]);
    expect(newState.hasMore).toBe(true);
  });

  it("should reset store state", () => {
    const store = useAuthorStore.getState();

    // Set some values first
    store.setQuery("test");
    store.authors = [
      {
        key: "1",
        name: "Test Author",
        author_name: ["test", "test1"],
        edition_count: 2019,
        first_publish_year: 2019,
        language: ["vietnamese", "france"],
        top_work: "test1",
      },
    ];
    store.page = 2;
    store.hasMore = false;
    store.error = "test error";

    // Reset
    store.reset();

    // Verify reset state
    const resetState = useAuthorStore.getState();
    expect(resetState.authors).toEqual([]);
    expect(resetState.page).toBe(1);
    expect(resetState.hasMore).toBe(true);
    expect(resetState.error).toBeNull();
  });

  describe("fetchAuthors", () => {
    it("should fetch authors successfully", async () => {
      const mockResponse = {
        data: {
          docs: [
            { key: "1", name: "Author 1" },
            { key: "2", name: "Author 2" },
          ],
          numFound: 20,
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const store = useAuthorStore.getState();
      store.setQuery("test");
      await store.fetchAuthors();

      const state = useAuthorStore.getState();
      expect(state.authors).toEqual(mockResponse.data.docs);
      expect(state.page).toBe(2);
      expect(state.hasMore).toBe(true);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should handle API errors", async () => {
      const errorMessage = "Network Error";
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      const store = useAuthorStore.getState();
      store.setQuery("test");
      await store.fetchAuthors();

      const state = useAuthorStore.getState();
      expect(state.error).toBe(errorMessage);
      expect(state.loading).toBe(false);
    });

    it("should not fetch if hasMore is false", async () => {
      const store = useAuthorStore.getState();
      store.hasMore = false;
      await store.fetchAuthors();

      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it("should not fetch if already loading", async () => {
      const store = useAuthorStore.getState();
      store.loading = true;
      await store.fetchAuthors();

      expect(mockedAxios.get).not.toHaveBeenCalled();
    });
  });
});
