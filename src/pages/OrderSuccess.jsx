import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function OrderSuccess() {
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
      <Card className="p-4 shadow-sm border-success">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success mb-2">✓ Дякуємо за замовлення!</h2>
          <p className="text-secondary">Ваше замовлення успішно створено</p>
        </div>

        <Card.Body>
          <div className="row mb-4">
            <div className="col-md-6">
              <h5 className="fw-bold mb-3">Деталі замовлення:</h5>
              <p><strong>Номер:</strong> {order.id}</p>
              <p><strong>Статус:</strong> <span className="badge bg-info">{order.status}</span></p>
              <p><strong>Дата:</strong> {order.date}</p>
            </div>
            <div className="col-md-6">
              <h5 className="fw-bold mb-3">Контактні дані:</h5>
              <p><strong>Ім'я:</strong> {order.customer.name}</p>
              <p><strong>Email:</strong> {order.customer.email}</p>
              <p><strong>Телефон:</strong> {order.customer.phone}</p>
            </div>
          </div>

          <h5 className="fw-bold mb-3">Товари:</h5>
          <ul className="list-unstyled">
            {order.items.map((item, idx) => (
              <li key={idx} className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                <span>{item.name} × {item.qty}</span>
                <strong>{(item.price * item.qty).toFixed(2)} грн</strong>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-3 border-top">
            <h4 className="fw-bold text-success">
              Загальна сума: {order.total.toFixed(2)} грн
            </h4>
          </div>

          <div className="mt-4">
            <p className="text-secondary small">
              На вказаний вами email було відправлено підтвердження замовлення.
              Ви можете відстежити статус замовлення в особистому кабінеті.
            </p>
          </div>
        </Card.Body>

        <div className="d-flex gap-3 justify-content-center mt-4">
          <Link to="/products" className="btn btn-primary">
            Продовжити покупки
          </Link>
          <Link to="/" className="btn btn-secondary">
            На головну
          </Link>
        </div>
      </Card>
    </Container>
  );
}
