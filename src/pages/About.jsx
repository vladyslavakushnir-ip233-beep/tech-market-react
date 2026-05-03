import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/About.css";

export default function About() {
  return (
    <div className="about-page">
      {/* Navigation Links */}
      <nav className="about-nav sticky-top bg-light border-bottom py-3">
        <Container>
          <div className="d-flex gap-4 flex-wrap">
            <a href="#about-us" className="about-nav-link">Про нас</a>
            <a href="#our-mission" className="about-nav-link">Наша місія</a>
            <a href="#our-values" className="about-nav-link">Наші цінності</a>
            <a href="#our-services" className="about-nav-link">Послуги</a>
            <a href="#contact-info" className="about-nav-link">Контакти</a>
            <a href="#working-hours" className="about-nav-link">Графік роботи</a>
          </div>
        </Container>
      </nav>

      {/* About Us Section */}
      <section id="about-us" className="py-5 bg-gradient-primary">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold text-white mb-4">TechMarket</h1>
              <p className="lead text-white mb-3">
                Ми - провідний інтернет-магазин електроніки та техніки для дому в Україні.
              </p>
              <p className="text-white mb-4">
                Заснована у 2020 році, наша компанія швидко завоювала довіру мільйонів покупців 
                завдяки якісній продукції, справедливим цінам та відмінному обслуговуванню.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/products" className="btn-custom-primary">
                  Перейти до каталогу
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <Card className="border-0 shadow-lg">
                <Card.Body className="p-4">
                  <div className="text-center">
                    <h3 className="text-primary fw-bold mb-3">Чому саме ми?</h3>
                    <ul className="list-unstyled">
                      <li className="mb-3">✓ Більше 5000+ товарів у каталозі</li>
                      <li className="mb-3">✓ Швидка доставка в межах 24 годин</li>
                      <li className="mb-3">✓ Гарантія якості на всі товари</li>
                      <li className="mb-3">✓ Підтримка 24/7</li>
                      <li className="mb-3">✓ Безпечні способи оплати</li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission Section */}
      <section id="our-mission" className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Наша Місія</h2>
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm card-hover">
                <Card.Body>
                  <div className="text-center">
                    <div className="icon-box bg-gradient-primary mb-3">💡</div>
                    <h5 className="fw-bold mb-3">Інновації</h5>
                    <p className="text-secondary">
                      Ми постійно оновлюємо каталог найновішими технологіями та гаджетами.
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm card-hover">
                <Card.Body>
                  <div className="text-center">
                    <div className="icon-box bg-gradient-success mb-3">👥</div>
                    <h5 className="fw-bold mb-3">Сервіс</h5>
                    <p className="text-secondary">
                      Наша команда завжди готова допомогти вам знайти ідеальний товар.
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm card-hover">
                <Card.Body>
                  <div className="text-center">
                    <div className="icon-box bg-gradient-info mb-3">🎯</div>
                    <h5 className="fw-bold mb-3">Якість</h5>
                    <p className="text-secondary">
                      Кожен товар ретельно перевіряється перед відправкою покупцю.
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Values Section */}
      <section id="our-values" className="py-5">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Наші Цінності</h2>
          <Row>
            <Col md={6} className="mb-4">
              <div className="value-item p-4 border-start border-primary border-5">
                <h5 className="fw-bold text-primary mb-2">Честість</h5>
                <p className="text-secondary">
                  Ми завжди прозорі з нашими клієнтами - без прихованих комісій та зборів.
                </p>
              </div>
            </Col>
            <Col md={6} className="mb-4">
              <div className="value-item p-4 border-start border-success border-5">
                <h5 className="fw-bold text-success mb-2">Надійність</h5>
                <p className="text-secondary">
                  Ми виконуємо свої зобов'язання в установлені терміни та з найвищою якістю.
                </p>
              </div>
            </Col>
            <Col md={6} className="mb-4">
              <div className="value-item p-4 border-start border-info border-5">
                <h5 className="fw-bold text-info mb-2">Інновація</h5>
                <p className="text-secondary">
                  Постійно розвиваємось і впроваджуємо нові технології для зручності клієнтів.
                </p>
              </div>
            </Col>
            <Col md={6} className="mb-4">
              <div className="value-item p-4 border-start border-warning border-5">
                <h5 className="fw-bold text-warning mb-2">Екологічність</h5>
                <p className="text-secondary">
                  Дбаємо про довкілля через еко-упаковку та переробку матеріалів.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section id="our-services" className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Наші Послуги</h2>
          <Row>
            <Col lg={3} md={6} className="mb-4">
              <div className="service-card text-center p-4">
                <div className="service-icon mb-3">🚚</div>
                <h5 className="fw-bold mb-2">Доставка</h5>
                <p className="text-secondary small">
                  Швидка доставка по всій Україні за 24-48 годин
                </p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="service-card text-center p-4">
                <div className="service-icon mb-3">🛡️</div>
                <h5 className="fw-bold mb-2">Гарантія</h5>
                <p className="text-secondary small">
                  Повна гарантія якості на всю продукцію
                </p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="service-card text-center p-4">
                <div className="service-icon mb-3">💳</div>
                <h5 className="fw-bold mb-2">Оплата</h5>
                <p className="text-secondary small">
                  Безпечна оплата всіма популярними методами
                </p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="service-card text-center p-4">
                <div className="service-icon mb-3">📞</div>
                <h5 className="fw-bold mb-2">Підтримка</h5>
                <p className="text-secondary small">
                  Професійна підтримка 24/7 для вас
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Info Section */}
      <section id="contact-info" className="py-5">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Залишитися з нами у контакті</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-sm text-center h-100 card-hover">
                <Card.Body className="p-4">
                  <div className="contact-icon mb-3">📧</div>
                  <h5 className="fw-bold mb-2">Email</h5>
                  <p className="text-secondary mb-0">info@techmarket.local</p>
                  <p className="text-secondary small">support@techmarket.local</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-sm text-center h-100 card-hover">
                <Card.Body className="p-4">
                  <div className="contact-icon mb-3">📞</div>
                  <h5 className="fw-bold mb-2">Телефон</h5>
                  <p className="text-secondary mb-0">+380 (44) 123-45-67</p>
                  <p className="text-secondary small">+380 (50) 987-65-43</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-sm text-center h-100 card-hover">
                <Card.Body className="p-4">
                  <div className="contact-icon mb-3">📍</div>
                  <h5 className="fw-bold mb-2">Адреса</h5>
                  <p className="text-secondary mb-0">м. Київ, вул. Технологічна, 42</p>
                  <p className="text-secondary small">Офіс 305</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col className="text-center">
              <p className="text-secondary">
                Хочеш дізнатися більше? <Link to="/contacts" className="text-decoration-none fw-bold">Перейди на сторінку контактів →</Link>
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Working Hours Section */}
      <section id="working-hours" className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Графік Роботи</h2>
          <Row>
            <Col lg={6} className="mx-auto">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="text-center mb-4">
                    <h5 className="fw-bold text-primary mb-0">Ми працюємо для тебе</h5>
                  </div>
                  <table className="table table-hover">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Понеділок - П'ятниця</td>
                        <td className="text-end">9:00 - 18:00</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Субота</td>
                        <td className="text-end">10:00 - 16:00</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Неділя</td>
                        <td className="text-end">10:00 - 15:00</td>
                      </tr>
                      <tr>
                        <td className="fw-bold text-success">Онлайн підтримка</td>
                        <td className="text-end text-success fw-bold">24/7</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="alert alert-info mt-4 mb-0">
                    ℹ️ Доставка здійснюється щодня, включаючи вихідні дні
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-gradient-primary">
        <Container>
          <div className="text-center">
            <h2 className="text-white fw-bold mb-4">Готовий розпочати?</h2>
            <p className="text-white mb-4 lead">
              Приєднайся до сотень тисяч задоволених клієнтів
            </p>
            <Button as={Link} to="/products" className="btn-custom-white btn-lg">
              Перейти до каталогу →
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
