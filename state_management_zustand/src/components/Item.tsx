export interface Book {
  key?: string;
  title: string;
  author_name: string[];
  language: string[];
  first_publish_year: number;
  edition_count: number;
}

export interface Author {
  key?: string;
  author_name: string[];
  language: string[];
  first_publish_year: number;
  edition_count: number;
  name: string;
  top_work: string;
}

const Item = ({ book, item }: { book: boolean; item: Author | Book }) => {
  if (book) {
    return (
      <div
        data-testid="item-container"
        className={`col-span-4 flex flex-col gap-3 items-start px-2 py-1 border-[1px] rounded-lg border-zinc-600 ${
          book && "book-item"
        }`}
      >
        <span>Title: {(item as Book)?.title}</span>
        <span>
          Author Name:{" "}
          {(item as Book).author_name?.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </span>
        <span>
          Languages:{" "}
          {(item as Book).language?.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </span>
        <span>First Public Year: {(item as Book).first_publish_year}</span>
        <span>Edition Count: {(item as Book).edition_count}</span>
      </div>
    );
  }

  return (
    <div
      data-testid="item-container"
      className={`col-span-4 flex flex-col gap-3 items-start px-2 py-1 border-[1px] rounded-lg border-zinc-600 ${
        !book && "author-item"
      }`}
    >
      <span>
        Author Name:{" "}
        {(item as Author).author_name.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </span>
      <span>
        Languages:{" "}
        {(item as Author).language?.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </span>
      <span>First Public Year: {(item as Author).first_publish_year}</span>
      <span>Edition Count: {(item as Author).edition_count}</span>
    </div>
  );
};

export default Item;
