import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-5 py-4 bg-dark text-light">
      <Container>
        <Row>
          <Col md={3} className="mb-3 mb-md-0">
            <h5 className="fw-bold">TechMarket</h5>
            <p className="small text-secondary">
              Інтернет-магазин електроніки та техніки для будинку
            </p>
          </Col>

          <Col md={3} className="mb-3 mb-md-0">
            <h6 className="fw-bold">Навігація</h6>
            <ul className="list-unstyled small">
              <li><Link to="/" className="text-secondary text-decoration-none">Головна</Link></li>
              <li><Link to="/products" className="text-secondary text-decoration-none">Каталог</Link></li>
              <li><Link to="/about" className="text-secondary text-decoration-none">Про нас</Link></li>
              <li><Link to="/contacts" className="text-secondary text-decoration-none">Контакти</Link></li>
              <li><Link to="/cart" className="text-secondary text-decoration-none">Кошик</Link></li>
            </ul>
          </Col>

          <Col md={3} className="mb-3 mb-md-0">
            <h6 className="fw-bold">Контакти</h6>
            <p className="small text-secondary mb-1">
              📞 +380 (44) 123-45-67
            </p>
            <p className="small text-secondary mb-1">
              ✉️ info@techmarket.local
            </p>
            <p className="small text-secondary">
              🕐 Пн-Пт: 9:00 - 18:00<br />
              Сб-Нд: 10:00 - 16:00
            </p>
          </Col>

          <Col md={3} className="mb-3 mb-md-0">
            <h6 className="fw-bold">Інформація</h6>
            <ul className="list-unstyled small">
              <li><Link to="/about#about-us" className="text-secondary text-decoration-none">Про нас</Link></li>
              <li><Link to="/about#our-mission" className="text-secondary text-decoration-none">Наша місія</Link></li>
              <li><Link to="/about#our-values" className="text-secondary text-decoration-none">Наші цінності</Link></li>
              <li><Link to="/about#contact-info" className="text-secondary text-decoration-none">Контакти</Link></li>
            </ul>
          </Col>
        </Row>

        <hr className="my-4 border-secondary" />

        <Row>
          <Col md={6}>
            <p className="small text-secondary mb-0">
              © {currentYear} TechMarket. Усі права захищені.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="small text-secondary mb-0">
              Розробник: <strong>Kushnir Vlada</strong>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
