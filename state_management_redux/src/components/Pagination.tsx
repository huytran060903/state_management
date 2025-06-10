import { useSearchParams } from "react-router-dom";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { NUMBER_ITEM_IN_A_PAGE } from "../constants";
const Pagination = ({ count }: { count: number }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const MAX_PAGE = Math.ceil(count / NUMBER_ITEM_IN_A_PAGE);

  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const handleSetPage = (page: number) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm">
        Showing
        <span className="font-medium">
          {" "}
          {(page - 1) * NUMBER_ITEM_IN_A_PAGE + 1}{" "}
        </span>
        from
        <span className="font-medium">
          {" "}
          {page === MAX_PAGE ? count : page * NUMBER_ITEM_IN_A_PAGE}{" "}
        </span>
        data
      </p>
      <div className="flex items-center bg-slate-800 rounded-lg">
        {page > 1 && (
          <div
            onClick={() => handleSetPage(page - 1)}
            className="py-2 px-3 hover:cursor-pointer hover:bg-slate-950 transition-all duration-300  rounded-md"
          >
            <MdOutlineKeyboardArrowLeft size={20} />
          </div>
        )}
        <div className="py-2 px-3 rounded-md bg-green-500">{page}</div>
        {page < MAX_PAGE && (
          <div
            onClick={() => handleSetPage(page + 1)}
            className="py-2 px-3 hover:cursor-pointer hover:bg-slate-950 transition-all duration-300  rounded-md"
          >
            <MdOutlineKeyboardArrowRight size={20} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
