import React from "react";
import "./App.css";
import Rack from "./Rack";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Loader from "./Loader";
import * as BooksAPI from "./BooksAPI";

class BooksApp extends React.Component {
  state = {
    isLoading: false,
  };

  loadToState = () => {
    BooksAPI.getAll()
      .then((books) => {
        let wantToRead = [],
          read = [],
          currentlyReading = [];

        books.map((book) => {
          const { shelf } = book;
          switch (shelf) {
            case "currentlyReading":
              currentlyReading.push(book);
              return null;
            case "wantToRead":
              wantToRead.push(book);
              return null;
            case "read":
              read.push(book);
              return null;
            default:
              return null;
          }
        });

        this.setState({
          searchResult: [],
          wantToRead,
          read,
          currentlyReading,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log("Error fetching data", err);
        this.setState({ isLoading: true });
      });
  };

  componentDidMount() {
    this.loadToState();
  }

  shelfChangeHandler = (book, newShelf) => {
    let previousShelf = book.shelf;

    let currentShelfBooksUpdated =
      previousShelf !== "none"
        ? this.state[previousShelf].filter((rec) => rec.id !== book.id)
        : null;

    book.shelf = newShelf;

    if (newShelf !== "none" && previousShelf !== "none") {
      this.setState((prevState) => ({
        [previousShelf]: currentShelfBooksUpdated,
        [newShelf]: [...prevState[newShelf], book],
      }));
    } else if (previousShelf === "none") {
      this.setState((prevState) => ({
        [newShelf]: [...prevState[newShelf], book],
      }));
    } else if (newShelf === "none") {
      this.setState({ [previousShelf]: currentShelfBooksUpdated });
    }

    BooksAPI.update(book, newShelf)
      .then(() => {
        console.log("Book shelf changed and updated at server");
      })
      .catch((err) => {
        console.log("Error updating shelf", err);

        let currentShelfBooksUpdated =
          newShelf !== "none"
            ? this.state[newShelf].filter((rec) => rec.id !== book.id)
            : null;

        book.shelf = previousShelf;

        if (newShelf !== "none" && previousShelf !== "none") {
          this.setState((prevState) => ({
            [newShelf]: currentShelfBooksUpdated,
            [previousShelf]: [...prevState[previousShelf], book],
          }));
        } else if (previousShelf === "none") {
          this.setState({
            [newShelf]: currentShelfBooksUpdated,
          });
        } else if (newShelf === "none") {
          this.setState((prevState) => ({
            [previousShelf]: [...prevState[previousShelf], book],
          }));
        }
      });
  };

  render() {
    return (
      <Router>
        <div className="list-books">
          {this.state.isLoading ? (
            <Loader msg="Unable to load data, please try again later" />
          ) : (
            <div className="app">
              <Route
                exact
                path="/"
                render={() => (
                  <Rack
                    shelfChangeHandler={this.shelfChangeHandler}
                    currentlyReading={this.state.currentlyReading}
                    wantToRead={this.state.wantToRead}
                    read={this.state.read}
                  />
                )}
              />
            </div>
          )}
        </div>
      </Router>
    );
  }
}

export default BooksApp;
