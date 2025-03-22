import React from "react";
import BookList from "./components/BookList";
import "bootstrap/dist/css/bootstrap.min.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1 className="text-center mt-4">Mission 11: Online Bookstore</h1>
      <BookList />
    </div>
  );
};

export default App;
