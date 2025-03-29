import React, { useEffect, useState } from "react";
import { Table, Pagination, Form, Button } from "react-bootstrap";

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          pageSize: booksPerPage.toString(),
          ...(sortBy ? { sortBy } : {}), // Include sorting if selected
        });

        const response = await fetch(`http://localhost:5119/api/books?${queryParams}`);
        const data = await response.json();

        console.log("Fetched books:", data); // Debugging

        setBooks(data.books);
        setTotalRecords(data.totalRecords); // Use backend total count for pagination
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [currentPage, booksPerPage, sortBy]);

  // Calculate total pages based on API response
  const totalPages = Math.ceil(totalRecords / booksPerPage);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Book List</h2>

      {/* Sorting */}
      <Button
        className="btn btn-primary mb-3"
        onClick={() => setSortBy(sortBy === "title" ? "author" : "title")}
      >
        Sort by {sortBy === "title" ? "Author" : "Title"}
      </Button>

      {/* Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.isbn}</td>
              <td>{book.classification}</td>
              <td>{book.category}</td>
              <td>{book.pageCount}</td>
              <td>{book.price.toFixed(2)}</td>
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
      <Form.Group controlId="booksPerPage">
        <Form.Label>Books per page:</Form.Label>
        <Form.Control
          as="select"
          value={booksPerPage}
          onChange={(e) => {
            setBooksPerPage(Number(e.target.value));
            setCurrentPage(1); // Reset to page 1 when changing page size
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </Form.Control>
      </Form.Group>
    </div>
  );
};

export default BookList;
