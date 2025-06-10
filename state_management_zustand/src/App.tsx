import { useEffect, useRef, useState } from "react";
import Header from "./components/Header.tsx";
import Heading from "./components/Heading.tsx";
import Search from "./components/Search.tsx";
import { CiSearch } from "react-icons/ci";
import { useSearchParams } from "react-router-dom";

import Item from "./components/Item.tsx";
import Pagination from "./components/Pagination.tsx";
import { useSearchStore, type SearchState } from "./store/useSearchStore.ts";
const App = () => {
  const [curFilter, setCurFilter] = useState("books");
  const inputRef = useRef<null | HTMLInputElement>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const { data, numFound, loading, error, fetchData }: SearchState =
    useSearchStore();

  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  useEffect(() => {
    //Fetch data base on onMount life cycle
    fetchData(
      curFilter.toLowerCase(),
      inputRef.current?.value || "hello",
      page
    );
  }, [curFilter, inputRef.current?.value, fetchData, page]); // trigger when one of the value in array change

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //set params
    setSearchParams({
      filter: curFilter.toLowerCase(),
      search: inputRef.current ? inputRef.current.value : "",
      page: "1",
    });
    //fetch data
    fetchData(
      curFilter.toLowerCase(),
      inputRef.current?.value || "hello",
      searchParams.get("page") ? Number(searchParams.get("page")) : 1
    );
  };
  return (
    <div className="w-full p-0 m-0 box-border flex flex-col">
      <Heading />
      <div className="px-8 py-3" style={{ backgroundColor: "#e1dcc5" }}>
        <Header />
        <div className="flex flex-col bg-white p-4 rounded-lg">
          <Search curFilter={curFilter} setFilter={setCurFilter} />
          <form className="flex items-center gap-5 mt-2" onSubmit={onSubmit}>
            <div className="border-[1px] border-slate-400 rounded-md flex items-center">
              <input
                ref={inputRef}
                placeholder="Search"
                className="outline-none w-72 px-4 py-2"
              />
              <button type="submit">
                <CiSearch size={30} className="text-slate-600" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input name="type_book" defaultChecked type="radio" />
              <label>Everything</label>
            </div>
            <div className="flex items-center gap-2">
              <input name="type_book" type="radio" />
              <label>Ebooks</label>
            </div>
          </form>
        </div>
      </div>
      <div className="px-8 py-3 grid grid-cols-12">
        {loading ? (
          <div className="col-span-12 text-center">Loading</div>
        ) : data ? (
          data?.map((item, index: number) => (
            <Item key={index} book={curFilter === "books"} item={item} />
          ))
        ) : null}
      </div>
      <div className="flex justify-end w-full">
        {!loading && !error && Array.isArray(data) && (
          <Pagination count={numFound} />
        )}
      </div>
    </div>
  );
};

export default App;
