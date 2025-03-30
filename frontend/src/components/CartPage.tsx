import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Book {
  bookId: number;
  title: string;
  author: string;
  price: number;
}

interface CartItem {
  book: Book;
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  // Load cart from session storage
  useEffect(() => {
    const storedCart = sessionStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const cartTotal = cart.reduce(
    (acc, item) => acc + item.book.price * item.quantity,
    0
  );

  const handleContinueShopping = () => {
    navigate("/"); // Return to book list
  };

  return (
    <div className="container mt-4">
      <h2>Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.book.bookId}>
                  <td>{item.book.title}</td>
                  <td>{item.book.author}</td>
                  <td>{item.quantity}</td>
                  <td>${item.book.price.toFixed(2)}</td>
                  <td>${(item.book.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h5>Total: ${cartTotal.toFixed(2)}</h5>
        </>
      )}

      {/* Continue Shopping Button */}
      <Button
        className="mt-3"
        variant="primary"
        onClick={handleContinueShopping}
      >
        Continue Shopping
      </Button>
    </div>
  );
};

export default CartPage;
