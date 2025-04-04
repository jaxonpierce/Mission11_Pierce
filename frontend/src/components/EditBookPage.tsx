import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";

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
      const response = await fetch(`http://localhost:5119/api/books/${id}`);
      const data = await response.json();
      setBook(data);
    };
    fetchBook();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBook((prev) => prev && { ...prev, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5119/api/books/${id}`, {
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
