import React, { useEffect, useState } from "react";
import { Table, Button, Container, Form, Row, Col } from "react-bootstrap";
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

const AdminPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState<Omit<Book, "bookId">>({
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    classification: "",
    category: "",
    pageCount: 0,
    price: 0,
  });
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:5119/api/books?page=1&pageSize=1000");
      const data = await response.json();
      setBooks(data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({ ...prev, [name]: name === "price" || name === "pageCount" ? Number(value) : value }));
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5119/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook),
    });
    if (response.ok) {
      fetchBooks();
      alert("Book added!");
      setNewBook({
        title: "",
        author: "",
        publisher: "",
        isbn: "",
        classification: "",
        category: "",
        pageCount: 0,
        price: 0,
      });
    } else {
      alert("Failed to add book.");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this book?");
    if (!confirmed) return;

    const response = await fetch(`http://localhost:5119/api/books/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      fetchBooks();
      alert("Book deleted!");
    } else {
      alert("Failed to delete book.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Admin Dashboard</h2>
      <h3>Add a Book</h3>

      {/* Add Book Form */}
      <Form onSubmit={handleAddBook} className="mb-4">
        <Row>
          {Object.entries(newBook).map(([key, value]) => (
            <Col md={4} className="mb-2" key={key}>
              <Form.Group>
                <Form.Label>{key}</Form.Label>
                <Form.Control
                  type={key === "price" || key === "pageCount" ? "number" : "text"}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          ))}
        </Row>
        <Button type="submit" variant="success">
          Add Book
        </Button>
      </Form>
      <h2>List of Books:</h2>

      {/* Book Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Classification</th>
            <th>Pages</th>
            <th>Price ($)</th>
            <th>Actions</th>
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
              <td>{book.classification}</td>
              <td>{book.pageCount}</td>
              <td>{book.price.toFixed(2)}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/admin/edit/${book.bookId}`)}
                >
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(book.bookId)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminPage;
