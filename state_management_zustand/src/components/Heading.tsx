const Heading = () => {
  return (
    <div className="flex items-center justify-between bg-slate-800 text-white px-8 py-1">
      <span>INTERNET ARCHIVE</span>
      <div className="flex items-center gap-3">
        <button className="border p-2 rounded-lg border-white font-semibold">
          Donate
        </button>
        <button className="border p-2 rounded-lg border-white font-semibold">
          English
        </button>
      </div>
    </div>
  );
};

export default Heading;
