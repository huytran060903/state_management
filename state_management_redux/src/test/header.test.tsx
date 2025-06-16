import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import Header from "../components/Header";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

describe("Header Component", () => {
  const renderHeader = () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );
  };

  it("should render search input", () => {
    renderHeader();
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it("should render all search options", () => {
    renderHeader();
    const options = [
      "All",
      "Title",
      "Author",
      "Text",
      "Subject",
      "Lists",
      "Advanced",
    ];

    options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it("should update search input value", () => {
    renderHeader();
    const searchInput = screen.getByPlaceholderText(/search/i);

    fireEvent.change(searchInput, { target: { value: "test" } });

    expect(searchInput).toHaveValue("test");
  });
});


