import { render, screen } from "@testing-library/react";
import Item, { type Book, type Author } from "../components/Item";

import "@testing-library/jest-dom";

describe("Item Component", () => {
  const mockBook: Book = {
    key: "/works/OL1234W",
    title: "Test Book",
    author_name: ["Test Author"],
    first_publish_year: 2023,
    edition_count: 2019,
    language: ["eng"],
  };

  const mockAuthor: Author = {
    key: "/authors/OL1234A",
    name: "Test Author",
    author_name: ["test1", "test2"],
    edition_count: 2019,
    first_publish_year: 2019,
    language: ["vietnamese", "english"],
    top_work: "Best Book",
  };

  it("should render book item correctly", () => {
    render(<Item item={mockBook} book={true} />);

    expect(
      screen.getByText((content) => content.includes(mockBook.title))
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes(mockBook.author_name[0]))
    ).toBeInTheDocument();
  });

  it("should render author item correctly", () => {
    render(<Item item={mockAuthor} book={false} />);

    expect(
      screen.getByText((content) => content.includes(mockAuthor.author_name[0]))
    ).toBeInTheDocument();
  });

 
 

  it("should apply correct styling based on type", () => {
    const { rerender } = render(<Item item={mockBook} book={true} />);

    expect(screen.getByTestId("item-container")).toHaveClass("book-item");

    rerender(<Item item={mockAuthor} book={false} />);
    expect(screen.getByTestId("item-container")).toHaveClass("author-item");
  });
});
