import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function CartPage({ cart, onUpdateQty, onRemove }) {
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => {
    const finalPrice = item.discount ? (item.price * (1 - item.discount / 100)) : item.price;
    return sum + finalPrice * item.qty;
  }, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Кошик порожній!");
      return;
    }
    navigate('/checkout');
  };

  return (
    <Container className="my-4">
      <h1 className="fw-bold mb-4">Кошик</h1>

      {cart.length === 0 ? (
        <Card className="p-5 text-center shadow-sm">
          <p className="text-secondary fs-5 mb-3">Ваш кошик порожній.</p>
          <Link to="/products" className="btn btn-primary">
            Перейти до каталогу
          </Link>
        </Card>
      ) : (
        <Row className="g-4">
          <Col md={8}>
            {cart.map((item) => (
              <Card key={item.id} className="p-3 shadow-sm mb-3">
                <Row className="align-items-center">
                  <Col md={3} className="text-center">
                    <img
                      src={item.image || "https://via.placeholder.com/200"}
                      alt={item.name}
                      className="img-fluid"
                      style={{ maxHeight: "120px", objectFit: "contain" }}
                    />
                  </Col>

                  <Col md={5}>
                    <h5 className="fw-bold">
                      <Link to={`/products/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {item.name}
                      </Link>
                    </h5>
                    <p className="text-secondary mb-1">{item.description?.slice(0,60)}</p>
                    {item.discount ? (
                      <div><span className="text-muted text-decoration-line-through">{item.price} грн</span> <strong className="text-success">{(item.price * (1 - item.discount / 100)).toFixed(2)} грн</strong></div>
                    ) : (
                      <p className="text-secondary">{item.price} грн</p>
                    )}
                  </Col>

                  <Col md={2}>
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => onUpdateQty(item.id, Number(e.target.value))}
                    />
                  </Col>

                  <Col md={2} className="text-end">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onRemove(item.id)}
                    >
                      Видалити
                    </Button>
                  </Col>
                </Row>
              </Card>
            ))}
          </Col>

          <Col md={4}>
            <Card className="p-4 shadow-sm" style={{ position: 'sticky', top: 20 }}>
              <h4 className="fw-bold mb-4">Підсумок замовлення</h4>
              
              <div className="mb-3">
                {cart.map((item) => {
                  const finalPrice = item.discount ? (item.price * (1 - item.discount / 100)) : item.price;
                  return (
                    <div key={item.id} className="d-flex justify-content-between mb-2 fs-sm">
                      <span>{item.name} × {item.qty}</span>
                      <span>{(finalPrice * item.qty).toFixed(2)} грн</span>
                    </div>
                  );
                })}
              </div>

              <hr />

              <p className="fs-5 fw-bold">
                Загальна сума: <span className="text-success">{total.toFixed(2)} грн</span>
              </p>

              <Button
                variant="success"
                size="lg"
                className="w-100 mb-2"
                onClick={handleCheckout}
              >
                Оформити замовлення
              </Button>

              <Link to="/products" className="btn btn-secondary w-100">
                Продовжити покупки
              </Link>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}
