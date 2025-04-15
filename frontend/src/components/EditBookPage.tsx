import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

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

const EditBookPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/books/${id}`);
        if (!response.ok) throw new Error("Book not found");
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book:", error);
        alert("Failed to load book details.");
      }
    };
    fetchBook();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBook((prev) => prev && { ...prev, [name]: name === "price" || name === "pageCount" ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });

      if (response.ok) {
        alert("Book updated!");
        navigate("/admin/dashboard");
      } else {
        alert("Update failed.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong while updating the book.");
    }
  };

  if (!book) return <p>Loading book data...</p>;

  return (
    <Container className="mt-4">
      <h2>Edit Book</h2>
      <Form onSubmit={handleSubmit}>
        {Object.entries(book).map(([key, value]) =>
          key === "bookId" ? null : (
            <Form.Group key={key} className="mb-3">
              <Form.Label>{key}</Form.Label>
              <Form.Control
                type={key === "price" || key === "pageCount" ? "number" : "text"}
                name={key}
                value={value}
                onChange={handleChange}
              />
            </Form.Group>
          )
        )}
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
};

export default EditBookPage;
