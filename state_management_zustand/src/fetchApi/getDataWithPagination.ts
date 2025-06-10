import axios from "axios";
import { NUMBER_ITEM_IN_A_PAGE } from "../constants";

export const getDataWithPagination = async ({
  filter,
  search,
  page,
  filterObj,
}: {
  filter: string;
  search: string;
  page: number;
  filterObj: { title: string; author: string };
}) => {
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

    const { docs, numFound } = res.data;

    return { docs, numFound };
  } catch (error) {
    console.log(error);
    return [];
  }
};
