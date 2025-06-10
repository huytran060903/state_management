import axios from "axios";
import { NUMBER_ITEM_IN_A_PAGE } from "../constants";

export const getDataInfiniteLoad = async ({ pageParam = 1, query = "*" }) => {
  const res = await axios.get(
    `https://openlibrary.org/search/authors.json?q=${query}&offset=${
      (pageParam - 1) * NUMBER_ITEM_IN_A_PAGE
    }&limit=${NUMBER_ITEM_IN_A_PAGE}`
  );
  return {
    authors: res.data.docs,
    nextOffset: pageParam + NUMBER_ITEM_IN_A_PAGE,
    hasMore: res.data.docs.length === NUMBER_ITEM_IN_A_PAGE,
  };
};
