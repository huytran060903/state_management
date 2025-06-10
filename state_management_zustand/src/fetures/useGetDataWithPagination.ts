import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getDataWithPagination } from "../fetchApi/getDataWithPagination";

export const useGetDataWithPagination = () => {
  const [searchParams] = useSearchParams();

  const filter = searchParams.get("filter") || "books";
  const search = searchParams.get("search") || "hello";

  

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

 

  const page = Number(searchParams.get("page") || "1");

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getDataWithPagination({ filter, search, page,filterObj }),
    queryKey: ["data", filter, search, page,filterObj],
  });

  return { data, isLoading, isError };
};
