import React, { useEffect, useState } from "react";
import {
  Table,
  Pagination,
  Form,
  Button,
  OverlayTrigger,
  Tooltip,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

interface CartItem {
  book: Book;
  quantity: number;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [categories, setCategories] = useState<string[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const navigate = useNavigate(); // For navigation

  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = sessionStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const storedPage = sessionStorage.getItem("bookPage");
    if (storedPage) {
      setCurrentPage(Number(storedPage));
      sessionStorage.removeItem("bookPage");
    }
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          pageSize: booksPerPage.toString(),
          ...(sortBy ? { sortBy } : {}),
          ...(selectedCategory !== "All Categories" ? { category: selectedCategory } : {}),
        });

        const response = await fetch(`http://localhost:5119/api/books?${queryParams}`);
        const data = await response.json();

        setBooks(data.books);
        setTotalRecords(data.totalRecords);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [currentPage, booksPerPage, sortBy, selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5119/api/books/categories");
        const data = await response.json();
        setCategories(["All Categories", ...data]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const addToCart = (book: Book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.book.bookId === book.bookId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.book.bookId === book.bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { book, quantity: 1 }];
      }
    });

    triggerToast(`${book.title} has been added to your cart.`);
  };

  const handleViewCart = () => {
    sessionStorage.setItem("bookPage", currentPage.toString());
    navigate("/cart");
  };

  const totalPages = Math.ceil(totalRecords / booksPerPage);
  const cartTotal = cart.reduce((acc, item) => acc + item.book.price * item.quantity, 0);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Book List</h2>

      {/* Bootstrap Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)}>
          <Toast.Header>
            <strong className="me-auto">Added to Cart</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* View Cart Button */}
      <Button className="mb-3 me-2" variant="warning" onClick={handleViewCart}>
        View Cart
      </Button>

      {/* Category Filter */}
      <Form.Group controlId="categoryFilter" className="mb-3">
        <Form.Label>Filter by Category:</Form.Label>
        <Form.Control
          as="select"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {/* Sorting */}
      <Button
        className="btn btn-primary mb-3"
        onClick={() => setSortBy(sortBy === "title" ? "author" : "title")}
      >
        Sort by {sortBy === "title" ? "Author" : "Title"}
      </Button>

      {/* Cart Summary */}
      <div className="mb-4">
        <h4>Cart Summary</h4>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.book.bookId}>
                {item.book.title} (x{item.quantity}) — $
                {(item.book.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
        )}
        <p>
          <strong>Total:</strong> ${cartTotal.toFixed(2)}
        </p>
      </div>

      {/* Book Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price ($)</th>
            <th>Add to Cart</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.bookId}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.isbn}</td>
              <td>{book.category}</td>
              <td>{book.pageCount}</td>
              <td>{book.price.toFixed(2)}</td>
              <td>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-${book.bookId}`}>Add this book to your cart</Tooltip>}
                >
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => addToCart(book)}
                  >
                    Add to Cart
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination>
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        />
        {[...Array(totalPages).keys()].map((num) => (
          <Pagination.Item
            key={num + 1}
            active={num + 1 === currentPage}
            onClick={() => setCurrentPage(num + 1)}
          >
            {num + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        />
      </Pagination>

      {/* Books per page */}
      <Form.Group controlId="booksPerPage" className="mt-3">
        <Form.Label>Books per page:</Form.Label>
        <Form.Control
          as="select"
          value={booksPerPage}
          onChange={(e) => {
            setBooksPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </Form.Control>
      </Form.Group>
      <Button
  variant="dark"
  style={{
    position: "fixed",
    bottom: "20px",
    right: "20px",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    fontSize: "0.8rem",
    zIndex: 1000,
  }}
  onClick={() => navigate("/admin")}
>
  Admin
</Button>

    </div>
  );
};

export default BookList;
