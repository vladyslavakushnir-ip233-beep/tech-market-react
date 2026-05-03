import { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { createOrder } from "../api/api";

export default function Checkout({ cart, setCart }) {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    city: "",
    address: "",
    delivery: "nova-poshta",
    payment: "card",
    comment: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const total = cart.reduce((sum, item) => {
    const finalPrice = item.discount ? (item.price * (1 - item.discount / 100)) : item.price;
    return sum + finalPrice * item.qty;
  }, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.name || !formData.phone || !formData.address) {
        throw new Error("Заповніть усі обов'язкові поля!");
      }

      if (cart.length === 0) {
        throw new Error("Кошик порожній!");
      }

      const orderData = {
        customer: formData,
        items: cart.map((item) => ({
          product_id: item.id,
          qty: item.qty,
          price: item.price,
        })),
        total: total,
      };

      const result = await createOrder(orderData, token);

      const order = {
        id: result.orderId,
        items: cart,
        customer: formData,
        total,
        status: "new",
        date: new Date().toLocaleString("uk-UA"),
      };
      localStorage.setItem("lastOrder", JSON.stringify(order));
      setCart([]);
      navigate("/order-success");
    } catch (err) {
      setError(err.message || "Помилка при створенні замовлення");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <h1 className="fw-bold mb-4">Оформлення замовлення</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4">
        <Col md={7}>
          <Card className="p-4 shadow-sm">
            <h4 className="fw-bold mb-3">Контактні дані</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Ім'я та прізвище *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Row className="mb-3">
                <Col>
                  <Form.Label>Телефон *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="+380..."
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Місто *</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Адреса доставки *</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Row className="mb-3">
                <Col>
                  <Form.Label>Доставка</Form.Label>
                  <Form.Select
                    name="delivery"
                    value={formData.delivery}
                    onChange={handleChange}
                  >
                    <option value="nova-poshta">Нова Пошта</option>
                    <option value="courier">Кур’єр по місту</option>
                    <option value="pickup">Самовивіз</option>
                  </Form.Select>
                </Col>

                <Col>
                  <Form.Label>Оплата</Form.Label>
                  <Form.Select
                    name="payment"
                    value={formData.payment}
                    onChange={handleChange}
                  >
                    <option value="card">Карткою онлайн</option>
                    <option value="cash">Готівкою</option>
                    <option value="bank-transfer">Переводом</option>
                  </Form.Select>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Коментар до замовлення</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button variant="success" size="lg" type="submit" disabled={loading} className="w-100">
                {loading ? "Обробка..." : "Підтвердити замовлення"}
              </Button>
            </Form>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="p-4 shadow-sm" style={{ position: 'sticky', top: 20 }}>
            <h4 className="fw-bold mb-3">Ваше замовлення</h4>

            {cart.map((item) => {
              const finalPrice = item.discount ? (item.price * (1 - item.discount / 100)) : item.price;
              return (
                <div key={item.id} className="mb-3 d-flex justify-content-between small">
                  <span>{item.name} × {item.qty}</span>
                  <strong>{(finalPrice * item.qty).toFixed(2)} грн</strong>
                </div>
              );
            })}

            <hr />

            <h4 className="fw-bold text-success">
              Разом: {total.toFixed(2)} грн
            </h4>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
