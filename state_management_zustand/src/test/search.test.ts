import { useSearchStore } from '../store/useSearchStore';
import axios from 'axios';
import {  act } from '@testing-library/react';
import { NUMBER_ITEM_IN_A_PAGE } from '../constants';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useSearchStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    act(() => {
      const store = useSearchStore.getState();
      store.data = [];
      store.numFound = 0;
      store.loading = false;
      store.error = null;
    });
  });

  it('should initialize with default values', () => {
    const store = useSearchStore.getState();
    expect(store.data).toEqual([]);
    expect(store.numFound).toBe(0);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('should fetch books data successfully', async () => {
    const mockResponse = {
      data: {
        docs: [{ title: 'Test Book' }],
        numFound: 1
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    await act(async () => {
      await useSearchStore.getState().fetchData('books', 'test', 1);
    });

    const store = useSearchStore.getState();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://openlibrary.org/search.json?title=test&offset=0&limit=${NUMBER_ITEM_IN_A_PAGE}`
    );
    expect(store.data).toEqual(mockResponse.data.docs);
    expect(store.numFound).toBe(1);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('should fetch authors data successfully', async () => {
    const mockResponse = {
      data: {
        docs: [{ name: 'Test Author' }],
        numFound: 1
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    await act(async () => {
      await useSearchStore.getState().fetchData('authors', 'test', 1);
    });

    const store = useSearchStore.getState();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://openlibrary.org/search.json?author=test&offset=0&limit=${NUMBER_ITEM_IN_A_PAGE}`
    );
    expect(store.data).toEqual(mockResponse.data.docs);
  });

  it('should handle filtered search with title and author', async () => {
    const mockResponse = {
      data: {
        docs: [{ title: 'Test Book', author_name: ['Test Author'] }],
        numFound: 1
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    await act(async () => {
      await useSearchStore.getState().fetchData('books', 'title:TestBook author:TestAuthor', 1);
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://openlibrary.org/search.json?title=TestBook&offset=0&limit=${NUMBER_ITEM_IN_A_PAGE}&author=TestAuthor`
    );
  });

  it('should handle API error', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

    await act(async () => {
      await useSearchStore.getState().fetchData('books', 'test', 1);
    });

    const store = useSearchStore.getState();
    expect(store.error).toBe(errorMessage);
    expect(store.loading).toBe(false);
  });

  it('should handle pagination offset', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { docs: [], numFound: 0 } });

    await act(async () => {
      await useSearchStore.getState().fetchData('books', 'test', 2);
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://openlibrary.org/search.json?title=test&offset=${NUMBER_ITEM_IN_A_PAGE}&limit=${NUMBER_ITEM_IN_A_PAGE}`
    );
  });

  it('should set loading state while fetching', async () => {
    mockedAxios.get.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    act(() => {
      useSearchStore.getState().fetchData('books', 'test', 1);
    });

    expect(useSearchStore.getState().loading).toBe(true);
  });
});