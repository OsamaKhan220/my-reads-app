import React, { Component } from "react";
import BookOnShelf from "./BookOnShelf";
import { Link } from "react-router-dom";

class SearchComponent extends Component {
  state = {
    searchTerm: "",
  };

  render() {
    const books = this.state.searchTerm ? this.props.searchResult : [];
    const shelfChangeHandler = this.props.shelfChangeHandler;
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/">
            <button className="close-search">Close</button>
          </Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              onChange={({ target }) => {
                this.setState({
                  searchTerm: target.value,
                });
                this.props.searchBooks(target.value);
              }}
              value={this.state.txtInput}
            />
          </div>
        </div>

        <div className="search-books-results">
          <BookOnShelf shelfChangeHandler={shelfChangeHandler} books={books} />
        </div>
      </div>
    );
  }
}

export default SearchComponent;