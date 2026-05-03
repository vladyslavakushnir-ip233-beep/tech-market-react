import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

export default function Cart({ cart, setCart }) {
  const updateQty = (id, qty) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: Number(qty) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <Container className="my-4">
      <h1 className="fw-bold mb-4">Кошик</h1>

      {cart.length === 0 && (
        <p className="text-secondary fs-5">Ваш кошик порожній.</p>
      )}

      <Row className="g-4">
        <Col md={8}>
          {cart.map((item) => (
            <Card key={item.id} className="p-3 shadow-sm mb-3">
              <Row>
                <Col md={3} className="text-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid"
                    style={{ maxHeight: "120px", objectFit: "contain" }}
                  />
                </Col>

                <Col md={5}>
                  <h5 className="fw-bold">{item.name}</h5>
                  <p className="text-secondary">{item.price} грн</p>
                </Col>

                <Col md={2}>
                  <Form.Control
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => updateQty(item.id, e.target.value)}
                  />
                </Col>

                <Col md={2} className="text-end">
                  <Button
                    variant="danger"
                    onClick={() => removeItem(item.id)}
                  >
                    Видалити
                  </Button>
                </Col>
              </Row>
            </Card>
          ))}
        </Col>

        {cart.length > 0 && (
          <Col md={4}>
            <Card className="p-4 shadow-sm">
              <h4 className="fw-bold">Підсумок замовлення</h4>
              <p className="fs-5">Загальна сума: {total} грн</p>

              <Button variant="success" size="lg" className="w-100">
                Оформити замовлення
              </Button>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}
