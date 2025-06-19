import { useEffect, useRef, useState } from "react";
import Header from "./components/Header.tsx";
import Heading from "./components/Heading.tsx";
import Search from "./components/Search.tsx";
import { CiSearch } from "react-icons/ci";
import { useSearchParams } from "react-router-dom";
import Item, { type Author, type Book } from "./components/Item.tsx";
import Pagination from "./components/Pagination.tsx";
import { useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "./store/store.ts";
import { useDispatch } from "react-redux";
import { fetchBookAndAuthor } from "./fetures/searchSlice.ts";
const App = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [curFilter, setCurFilter] = useState("books");
  const inputRef = useRef<null | HTMLInputElement>(null);
  const [typeBook, setTypeBook] = useState<string>(
    searchParams.get("mode") || "everything"
  );

  const data = useSelector((state: RootState) => state.search);

  const dispatch = useDispatch<AppDispatch>();

  const filter = searchParams.get("filter") || "books";
  const search = searchParams.get("search") || "hello";
  const page = Number(searchParams.get("page") || "1");

  useEffect(() => {
    dispatch(fetchBookAndAuthor({ filter, search, page, mode: typeBook }));
  }, [filter, search, page, dispatch, typeBook]);

  const handleChangeTypeBook = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypeBook(e.target.value);
    setSearchParams((initParams) => {
      initParams.set("mode", e.target.value);
      return initParams;
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchParams({
      filter: curFilter.toLowerCase(),
      search: inputRef.current ? inputRef.current.value : "",
      page: "1",
      mode: typeBook,
    });
    dispatch(fetchBookAndAuthor({ filter, search, page, mode: typeBook }));
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
                    value="everything"
                    checked={typeBook === "everything"}
                    onChange={handleChangeTypeBook}
                    name="type_book"
                    defaultChecked
                    type="radio"
                  />
                  <label>Everything</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value="ebooks"
                    onChange={handleChangeTypeBook}
                    checked={typeBook === "ebooks"}
                    name="type_book"
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
        {!data.loading && !data.error && data?.numFound > 0 && (
          <p className="col-span-12 my-3">Found: {data?.numFound} </p>
        )}
        {data.loading ? (
          <div className="col-span-12 text-center">Loading</div>
        ) : data && !Array.isArray(data) && data.data ? (
          data.data.length > 0 ? (
            data.data.map((item: Book | Author, index: number) => (
              <Item key={index} book={curFilter === "books"} item={item} />
            ))
          ) : (
            <div className="col-span-12 text-center">Not found</div>
          )
        ) : null}
      </div>
      <div className="flex justify-end w-full">
        {!data.loading &&
          !data.error &&
          !Array.isArray(data) &&
          data?.numFound !== 0 && <Pagination count={data?.numFound} />}
      </div>
    </div>
  );
};

export default App;
