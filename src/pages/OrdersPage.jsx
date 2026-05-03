import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function OrdersPage() {
  const order = JSON.parse(localStorage.getItem("lastOrder") || "null");

  if (!order) {
    return (
      <Container className="my-5 text-center">
        <h2>Замовлення не знайдено</h2>
        <Link to="/" className="btn btn-primary mt-3">
          Повернутись на головну
        </Link>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Card className="p-4 shadow-sm">
        <h2 className="fw-bold mb-3">Дякуємо за замовлення!</h2>
        <p>Номер замовлення: <strong>{order.id}</strong></p>
        <p>Статус: <strong>{order.status}</strong></p>
        <p>Дата: {order.date}</p>

        <h4 className="fw-bold mt-4">Ваші товари:</h4>

        <ul>
          {order.items.map((i) => (
            <li key={i.id}>
              {i.name} × {i.qty} — {i.price * i.qty} грн
            </li>
          ))}
        </ul>

        <h4 className="fw-bold mt-3">Сума: {order.total} грн</h4>

        <Link to="/" className="btn btn-primary mt-4">
          Повернутись на головну
        </Link>
      </Card>
    </Container>
  );
}
