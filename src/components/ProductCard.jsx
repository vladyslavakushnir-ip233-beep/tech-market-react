import { useState } from "react";
import { Card, Button, Toast, ToastContainer } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onAddToCart }) {
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      <Card className="h-100 shadow-sm product-card">
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>

          <div className="text-center p-3">
            <img
              src={product.image || "https://via.placeholder.com/200"}
              alt={product.name}
              className="img-fluid"
              style={{ maxHeight: "180px", objectFit: "contain" }}
            />
          </div>

          <Card.Body>
            <h5 className="fw-bold">{product.name}</h5>
            <p className="text-secondary small">{product.description?.slice(0, 80)}...</p>
            <div className="d-flex align-items-center gap-2">
              {product.discount ? (
                <>
                  <span className="text-muted text-decoration-line-through">{product.price} грн</span>
                  <h4 className="fw-bold text-success mb-0">{(product.price * (1 - product.discount / 100)).toFixed(2)} грн</h4>
                  <span className="badge bg-danger">{product.discount}%</span>
                </>
              ) : (
                <h4 className="fw-bold text-primary mb-0">{product.price} грн</h4>
              )}
            </div>
          </Card.Body>
        </Link>

        <Card.Footer className="bg-white border-0">
          <Button
            variant="success"
            className="w-100"
            onClick={handleAddToCart}
          >
            Додати в кошик
          </Button>
        </Card.Footer>
      </Card>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={showToast} bg="success" style={{ zIndex: 9999 }}>
          <Toast.Body className="text-white fw-bold">
            ✓ {product.name} додано в кошик!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
