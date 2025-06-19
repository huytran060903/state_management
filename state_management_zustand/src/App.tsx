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
  const [searchParams, setSearchParams] = useSearchParams();

  const [curFilter, setCurFilter] = useState("books");
  const inputRef = useRef<null | HTMLInputElement>(null);
  const [typeBook, setTypeBook] = useState<string>(
    searchParams.get("mode") || "everything"
  );

  const { data, numFound, loading, error, fetchData }: SearchState =
    useSearchStore();

  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  useEffect(() => {
    //Fetch data base on onMount life cycle
    fetchData(
      curFilter.toLowerCase(),
      inputRef.current?.value || "hello",
      page,
      typeBook
    );
  }, [curFilter, inputRef.current?.value, fetchData, page, typeBook]); // trigger when one of the value in array change

  const handleChangeTypeBook = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypeBook(e.target.value);
    setSearchParams((initParams) => {
      initParams.set("mode", e.target.value);
      return initParams;
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //set params
    setSearchParams({
      filter: curFilter.toLowerCase(),
      search: inputRef.current ? inputRef.current.value : "",
      page: "1",
      mode: typeBook,
    });
    //fetch data
    fetchData(
      curFilter.toLowerCase(),
      inputRef.current?.value || "hello",
      searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      typeBook
    );
  };
  return (
    <div className="w-full p-0 m-0 box-border flex flex-col">
      <Heading />
      <div className="px-8 py-3 bg-[#e1dcc5]">
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
            {curFilter === "books" && (
              <>
                <div className="flex items-center gap-2">
                  <input
                    name="type_book"
                    value="everything"
                    onChange={handleChangeTypeBook}
                    defaultChecked
                    checked={typeBook === "everything"}
                    type="radio"
                  />
                  <label>Everything</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value="ebooks"
                    name="type_book"
                    checked={typeBook === "ebooks"}
                    onChange={handleChangeTypeBook}
                    type="radio"
                  />
                  <label>Ebooks</label>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
      <div className="px-8 py-3 grid grid-cols-12 gap-3">
        {!loading && !error && numFound > 0 && (
          <p className="col-span-12 my-3">Found: {numFound} </p>
        )}
        {loading ? (
          <div className="col-span-12 text-center">Loading</div>
        ) : data.length > 0 ? (
          data?.map((item, index: number) => (
            <Item key={index} book={curFilter === "books"} item={item} />
          ))
        ) : (
          <div className="col-span-12 text-center">Not found</div>
        )}
      </div>
      <div className="flex justify-end w-full">
        {!loading && !error && Array.isArray(data) && numFound > 0 && (
          <Pagination count={numFound} />
        )}
      </div>
    </div>
  );
};

export default App;
