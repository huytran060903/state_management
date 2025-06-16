import React, { useCallback, useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoIosQrScanner } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { type AppDispatch, type RootState } from "../store/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchAuthor, resetAuthor } from "../fetures/authorInfiniteSearch";

const optionsType: string[] = [
  "All",
  "Title",
  "Author",
  "Text",
  "Subject",
  "Lists",
  "Advanced",
];

const Header = () => {
  const [curOption, setCurOption] = useState<string>("All");

  const [curInp, setCurInp] = useState<string>("");
  const [prevQuery, setPrevQuery] = useState("");
  const { list, loading, hasMore, page, error } = useSelector(
    (state: RootState) => state.author
  );

  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurOption(event.target.value);
  };

  //Create a ref to hold only a IntersectionObserver
  const observer = useRef<IntersectionObserver | null>(null);

  //Create a callback ref
  const lastBookRef = useCallback(
    (node: HTMLDivElement | null) => {
      //if is loading = true do nothing
      if (loading) return;

      //Disconnect with current last element
      if (observer.current) observer.current.disconnect();

      //Initial a IntersectionObserver
      observer.current = new IntersectionObserver((entries) => {
        //entries[0].isIntersecting = true that mean the last element was appeared in the viewpoint
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchAuthor({ query: curInp, page: page }));
        }
      });
      //Re-assign observe with last element
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, dispatch, page, curInp]
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (curInp && curInp !== prevQuery) {
        setPrevQuery(curInp);
        dispatch(resetAuthor());
        dispatch(fetchAuthor({ query: curInp, page: 1 }));
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [dispatch, curInp]);

  return (
    <div className="flex items-center justify-between w-full  gap-10">
      <img
        className="w-32 h-16"
        src="https://openlibrary.org/static/images/openlibrary-logo-tighter.svg"
      />
      <span>My Book</span>
      <span>Browse</span>
      <div
        onMouseLeave={() => {
          setCurInp("");
        }}
        className="flex items-center rounded-lg bg-white border-black border-[1px] flex-1 relative"
      >
        <select
          value={curOption}
          onChange={handleChange}
          className="border-r-[1px] border-amber-100 py-2 px-2"
          style={{ backgroundColor: "#b0aba052" }}
        >
          {optionsType.map((optionItem) => (
            <option key={optionItem} value={optionItem}>
              {optionItem}
            </option>
          ))}
        </select>
        <input
          value={curInp}
          onChange={(e) => {
            setCurInp(e.target.value);
          }}
          className="bg-white p-2 flex-1 outline-none "
          placeholder="Search"
          data-testid="search-input"
        />
        {/* Display load infinite */}
        <div
          className={`${
            curInp ? "block" : "hidden"
          } absolute bg-white top-10 border-[1px] rounded-lg p-2 max-h-52 overflow-y-auto left-0 right-0`}
        >
          {list?.map((author, index) => (
            <div
              key={index}
              ref={index === list.length - 1 ? lastBookRef : null}
              style={{
                padding: "10px",
                margin: "10px 0",
                background: "#f9f9f9",
                border: "1px solid #ddd",
              }}
            >
              <div
                key={index}
                className="p-2 rounded border border-gray-300 shadow-sm"
              >
                <p className="font-semibold">{author.name}</p>
                <p className="text-sm text-gray-600">
                  Top work: {author.top_work ?? "N/A"}
                </p>
              </div>
            </div>
          ))}
          {loading && <div className="w-full text-center">Loading...</div>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        {/*  */}
        <CiSearch size={28} />
        <div className="border-l-[1px] pl-2 ml-2">
          <IoIosQrScanner size={28} />
        </div>
      </div>
      <button>Log In</button>
      <button className="bg-blue-400 py-2 px-4 rounded-lg text-white font-semibold">
        Sign Up
      </button>
      <RxHamburgerMenu />
    </div>
  );
};

export default Header;
