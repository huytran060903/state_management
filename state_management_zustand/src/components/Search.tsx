import ItemFilter from "./ItemFilter";

const filters = [
  "Books",
  "Authors",
  "Search Inside",
  "Subjects",
  "Lists",
  "Advanced Search",
];

const Search = ({
  curFilter,
  setFilter,
}: {
  curFilter: string;
  setFilter: (value: string) => void;
}) => {
  return (
    <div className="w-full   flex flex-col gap-8 ">
      <h1 className="font-black text-5xl text-slate-500 ">Search Books</h1>
      <div className="flex items-center gap-1">
        {filters.map((search) => (
          <ItemFilter
            key={search}
            classFilter={
              curFilter === `${search[0].toLocaleLowerCase() + search.slice(1)}`
                ? "border-blue-500 text-blue-500"
                : "border-white"
            }
            setFilter={setFilter}
            value={search}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
