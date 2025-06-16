import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import ItemFilter from "../components/ItemFilter";
import Item, { type Author, type Book } from "../components/Item";

test("should first", () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>
  );

  expect(1).toBe(1);
});

describe("test render", () => {
  //Test render book with mock data
  test("test render item with book", () => {
    const newBook: Book = {
      title: "test",
      author_name: ["test1", "test2"],
      language: ["English", "France"],
      first_publish_year: 2019,
      edition_count: 20,
    };
    render(<Item book={true} item={newBook} />);
    //Render exactly data
    expect(screen.getByText("Title: test")).toBeInTheDocument();
  });

  //Test render author with mock data
  test("test render item with author", () => {
    const newAuthor: Author = {
      author_name: ["test1", "test2"],
      language: ["Japanese", "Vietnamese"],
      first_publish_year: 2019,
      edition_count: 3,
      top_work: "test top_work",
    };
    render(<Item book={false} item={newAuthor} />);
    //Render exactly data
    expect(screen.getByText("test1")).toBeInTheDocument();
    expect(screen.getByText("test2")).toBeInTheDocument();
  });

  test("item render with exactly text", () => {
    const mockSetFilter = jest.fn((value) => {
      console.log(value);
    });

    render(
      <MemoryRouter>
        <ItemFilter classFilter="" value="book" setFilter={mockSetFilter} />
      </MemoryRouter>
    );

    expect(screen.getByText("Book")).toBeInTheDocument();

    const buttonSearch = screen.getByTestId("button-search");

    fireEvent.click(buttonSearch);
    // check button have been clicked
    expect(mockSetFilter).toHaveBeenCalledTimes(1);
  });
});
