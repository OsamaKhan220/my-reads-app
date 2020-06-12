const api = "https://reactnd-books-api.udacity.com";

let token = localStorage.token;
if (!token) token = localStorage.token = Math.random().toString(36).substr(-8);

const headers = {
  Accept: "application/json",
  Authorization: token,
};

export const getAll = () =>
  fetch(`${api}/books`, { headers })
    .then((res) => res.json())
    .then((data) => data.books);

export const update = (book, shelf) =>
  fetch(`${api}/books/${book.id}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    method: "PUT",
    body: JSON.stringify({ shelf }),
  }).then((res) => res.json());
