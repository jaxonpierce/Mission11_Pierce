import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookList from "./components/BookList";
import CartPage from "./components/CartPage";
import AdminLogin from "./components/AdminLogin";
import AdminPage from "./components/AdminPage";
import EditBookPage from "./components/EditBookPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminPage />} />
        <Route path="/admin/edit/:id" element={<EditBookPage />} />
      </Routes>
    </Router>
  );
};

export default App;
