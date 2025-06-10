import { useSearchParams } from "react-router-dom";

const ItemFilter = ({
  classFilter,
  value,
  setFilter,
}: {
  classFilter: string;
  value: string;
  setFilter: (text: string) => void;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <button
      onClick={() => {
        setSearchParams({
          filter: value.toLowerCase(),
          search: searchParams.get("search") || "",
        });
        setFilter(value.toLowerCase());
      }}
      className={`px-2 py-3 font-semibold text-lg border-b-2 transition-all duration-300  ${classFilter}`}
    >
      {value[0].toUpperCase() + value.slice(1)}
    </button>
  );
};

export default ItemFilter;
