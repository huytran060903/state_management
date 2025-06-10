import { useInfiniteQuery } from "@tanstack/react-query";
import { getDataInfiniteLoad } from "../fetchApi/getDataInfiniteLoad";

export const useGetInfiniteLoad = ({ query = "*" }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["authors", query],
      queryFn: () => getDataInfiniteLoad({ query }),
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextOffset : undefined,
      initialPageParam: 1,
    });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
};
