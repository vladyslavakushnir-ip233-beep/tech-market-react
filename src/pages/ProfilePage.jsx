import { useState, useEffect } from "react";
import { Container, Card, Form, Button, Row, Col, Alert, ListGroup, Badge } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [tab, setTab] = useState("profile");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: localStorage.getItem("userPhone") || "",
    address: localStorage.getItem("userAddress") || "",
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const lastOrder = JSON.parse(localStorage.getItem("lastOrder") || "null");
    if (lastOrder) {
      setOrders([lastOrder]);
    }
  }, []);

  if (!user) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="warning">
          <h3>Ви не авторизовані</h3>
          <p>Для перегляду профіля потрібно увійти</p>
          <Button variant="primary" onClick={() => navigate("/login")}>
            Увійти
          </Button>
        </Alert>
      </Container>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setLoading(true);
    try {
      localStorage.setItem("userPhone", formData.phone);
      localStorage.setItem("userAddress", formData.address);
      setMessage({ type: "success", text: "✓ Профіль оновлено успішно!" });
    } catch (err) {
      setMessage({ type: "danger", text: "Помилка при оновленні профіля" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Container className="my-4">
      <h1 className="fw-bold mb-4">Мій профіль</h1>

      {message && (
        <Alert
          variant={message.type}
          onClose={() => setMessage(null)}
          dismissible
          className="mb-3"
        >
          {message.text}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={3}>
          <Card className="p-3 shadow-sm">
            <div className="text-center mb-3">
              <div
                className="mx-auto rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                style={{ width: "60px", height: "60px", fontSize: "28px" }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <h5 className="text-center fw-bold">{user.name}</h5>
            <p className="text-center text-secondary small">{user.email}</p>
            <hr />
            <Button
              variant={tab === "profile" ? "primary" : "outline-primary"}
              className="w-100 mb-2"
              onClick={() => setTab("profile")}
            >
              Профіль
            </Button>
            <Button
              variant={tab === "orders" ? "primary" : "outline-primary"}
              className="w-100 mb-2"
              onClick={() => setTab("orders")}
            >
              Замовлення ({orders.length})
            </Button>
            <Button
              variant="outline-danger"
              className="w-100"
              onClick={handleLogout}
            >
              Вихід
            </Button>
          </Card>
        </Col>

        <Col md={9}>
          {/* PROFILE TAB */}
          {tab === "profile" && (
            <Card className="p-4 shadow-sm">
              <h3 className="fw-bold mb-4">Особисті дані</h3>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Ім'я та прізвище</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    disabled
                    className="bg-light"
                  />
                  <small className="text-secondary">Можна змінити тільки на сервері</small>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="bg-light"
                  />
                  <small className="text-secondary">Можна змінити тільки на сервері</small>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Телефон</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="+380..."
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Адреса</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    placeholder="м. Київ, вул..."
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="mt-4">
                  <Button
                    variant="primary"
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="me-2"
                  >
                    {loading ? "Збереження..." : "Зберегти"}
                  </Button>
                </div>
              </Form>

              <hr className="my-4" />

              <h5 className="fw-bold mb-3">Інформація про акаунт</h5>
              <ListGroup>
                <ListGroup.Item>
                  <strong>Роль:</strong>{" "}
                  <Badge bg={user.role === "admin" ? "danger" : "success"}>
                    {user.role === "admin" ? "Адміністратор" : "Користувач"}
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>ID:</strong> {user.id}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          )}

          {/* ORDERS TAB */}
          {tab === "orders" && (
            <Card className="p-4 shadow-sm">
              <h3 className="fw-bold mb-4">Мої замовлення</h3>

              {orders.length === 0 ? (
                <Alert variant="info">
                  У вас поки немає замовлень. <Link to="/products">Розпочніть покупки!</Link>
                </Alert>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} className="mb-3 p-3 shadow-sm">
                    <Row>
                      <Col md={6}>
                        <p>
                          <strong>Номер замовлення:</strong> {order.id}
                        </p>
                        <p>
                          <strong>Дата:</strong> {order.date}
                        </p>
                        <p>
                          <strong>Статус:</strong>{" "}
                          <Badge bg="info">{order.status}</Badge>
                        </p>
                      </Col>
                      <Col md={6}>
                        <p>
                          <strong>Сума:</strong> <span className="fs-5 text-success">{order.total.toFixed(2)} грн</span>
                        </p>
                        <p>
                          <strong>Товарів:</strong> {order.items.length}
                        </p>
                      </Col>
                    </Row>

                    <hr />

                    <h6 className="fw-bold">Товари:</h6>
                    <ListGroup>
                      {order.items.map((item, idx) => (
                        <ListGroup.Item key={idx}>
                          {item.name} × {item.qty} = {(item.price * item.qty).toFixed(2)} грн
                        </ListGroup.Item>
                      ))}
                    </ListGroup>

                    <hr />

                    <h6 className="fw-bold">Доставка:</h6>
                    <p className="text-secondary small">
                      {order.customer?.address || "Адреса не вказана"}
                    </p>
                  </Card>
                ))
              )}
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}
