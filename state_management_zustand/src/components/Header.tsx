import React, { useCallback, useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoIosQrScanner } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { useAuthorStore } from "../store/useAuthorStore";

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

  const {
    authors,
    query,

    loading,
    hasMore,
    error,
    fetchAuthors,
    setQuery,
  } = useAuthorStore();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurOption(event.target.value);
  };

  //Create a ref to hold only a IntersectionObserver
  const observer = useRef<IntersectionObserver | null>(null);

  //Create a callback ref
  const lastAuthorRef = useCallback(
    (node: HTMLDivElement | null) => {
      // if is loading = true do nothing
      if (loading) return;

      // Disconnect with old observer
      if (observer.current) observer.current.disconnect();

      //Initial a IntersectionObserver
      observer.current = new IntersectionObserver((entries) => {
        //entries[0].isIntersecting = true that mean the last element was appeared in the viewpoint
        if (entries[0].isIntersecting && hasMore) {
          fetchAuthors();
        }
      });
      //Re-assign observe with last element
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchAuthors]
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (curInp !== query) {
        setQuery(curInp);
        fetchAuthors();
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [curInp]);

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
          className="border-r-[1px] border-amber-100 py-2 px-2 bg-[#b0aba052]"
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
        />
        {/* Display load infinite */}
        <div
          className={`${
            curInp ? "block" : "hidden"
          } absolute bg-white top-10 border-[1px] rounded-lg p-2 max-h-52  left-0 right-0`}
        >
          <div className="max-h-50 overflow-y-auto  rounded mb-1">
            {authors.length > 0
              ? authors.map((author, i) => (
                  <div
                    key={i}
                    ref={i === authors.length - 1 ? lastAuthorRef : null}
                    className="border-b "
                  >
                    <p className="font-bold">{author.name}</p>
                    <p className="text-sm text-gray-600">
                      Top work: {author.top_work ?? "N/A"}
                    </p>
                  </div>
                ))
              : !loading && <p className="text-center">No found data</p>}
            {loading && <div className="w-full text-center">Loading...</div>}
            {error && <p className="text-red-500">{error}</p>}
          </div>
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
