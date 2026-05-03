import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Contacts() {
  return (
    <Container className="my-5">
      <Card className="p-4 shadow-lg mb-5 border-0" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white' }}>
        <h1 className="fw-bold mb-3">Контакти TechMarket</h1>
        <p className="fs-5 mb-0">
          Ми завжди на звʼязку та готові допомогти з вибором техніки, 
          консультаціями, оформленням замовлення чи сервісними питаннями.
        </p>
      </Card>

      <Row className="g-4 mb-5">
        <Col md={4}>
          <Card className="p-4 shadow-sm h-100 border-0">
            <div className="text-center mb-3" style={{ fontSize: '2.5rem' }}>📧</div>
            <h5 className="fw-bold mb-3 text-center">Email</h5>
            <p className="text-center mb-1"><strong>Основна пошта</strong></p>
            <p className="text-center text-secondary mb-3">info@techmarket.local</p>
            <p className="text-center mb-0"><strong>Підтримка</strong></p>
            <p className="text-center text-secondary">support@techmarket.local</p>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-4 shadow-sm h-100 border-0">
            <div className="text-center mb-3" style={{ fontSize: '2.5rem' }}>📞</div>
            <h5 className="fw-bold mb-3 text-center">Телефон</h5>
            <p className="text-center mb-1"><strong>Основний</strong></p>
            <p className="text-center text-secondary mb-3">+380 (44) 123-45-67</p>
            <p className="text-center mb-0"><strong>Запасний</strong></p>
            <p className="text-center text-secondary">+380 (50) 987-65-43</p>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-4 shadow-sm h-100 border-0">
            <div className="text-center mb-3" style={{ fontSize: '2.5rem' }}>📍</div>
            <h5 className="fw-bold mb-3 text-center">Адреса</h5>
            <p className="text-center mb-1"><strong>Офіс</strong></p>
            <p className="text-center text-secondary mb-3">м. Київ, вул. Технологічна, 42<br/>Офіс 305</p>
            <p className="text-secondary small text-center">Доставка по всій Україні</p>
          </Card>
        </Col>
      </Row>

      <Card className="p-4 shadow-sm mb-5 border-0">
        <h3 className="fw-bold mb-4">Графік Роботи</h3>
        <Row>
          <Col md={6}>
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
          </Col>
          <Col md={6}>
            <div className="alert alert-info border-0">
              <strong>ℹ️ Важливо!</strong><br/>
              Доставка здійснюється щодня, включаючи вихідні дні.
              Замовлення, оформлені після 18:00, будуть оброблені наступного дня.
            </div>
          </Col>
        </Row>
      </Card>

      <Row className="mb-5">
        <Col md={6} className="mb-4 mb-md-0">
          <Card className="p-4 shadow-sm border-0 h-100">
            <h4 className="fw-bold mb-3">Доставка</h4>
            <ul className="list-unstyled">
              <li className="mb-2">✓ По всій території України</li>
              <li className="mb-2">✓ Швидкість: 24-48 годин</li>
              <li className="mb-2">✓ Безпечна упаковка</li>
              <li className="mb-2">✓ Трекування посилки</li>
              <li className="mb-0">✓ Можливість самовивозу</li>
            </ul>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-4 shadow-sm border-0 h-100">
            <h4 className="fw-bold mb-3">Оплата</h4>
            <ul className="list-unstyled">
              <li className="mb-2">✓ Карта Visa/Mastercard</li>
              <li className="mb-2">✓ Переклад на рахунок</li>
              <li className="mb-2">✓ Оплата при отриманні</li>
              <li className="mb-2">✓ Apple Pay / Google Pay</li>
              <li className="mb-0">✓ Кредит до 12 місяців</li>
            </ul>
          </Card>
        </Col>
      </Row>

      <Card className="p-4 shadow-sm mb-5 border-0">
        <h3 className="fw-bold mb-4">FAQ — Поширені Питання</h3>
        <Row>
          <Col md={6} className="mb-4">
            <div className="mb-3">
              <h6 className="fw-bold text-primary">❓ Як оформити замовлення?</h6>
              <p className="text-secondary small">Додайте товар у кошик, перейдіть до оформлення та виберіть спосіб оплати та доставки.</p>
            </div>
            <div className="mb-3">
              <h6 className="fw-bold text-primary">❓ Чи можна повернути товар?</h6>
              <p className="text-secondary small">Так, протягом 14 днів після отримання згідно із законодавством України.</p>
            </div>
          </Col>
          <Col md={6} className="mb-4">
            <div className="mb-3">
              <h6 className="fw-bold text-primary">❓ Скільки часу займає доставка?</h6>
              <p className="text-secondary small">Від 24 до 48 годин залежно від регіону України.</p>
            </div>
            <div className="mb-0">
              <h6 className="fw-bold text-primary">❓ Чи є гарантія на товари?</h6>
              <p className="text-secondary small">Так, гарантія від 12 до 36 місяців залежно від категорії товару.</p>
            </div>
          </Col>
        </Row>
      </Card>

      <Card className="p-4 shadow-sm mb-5 border-0" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
        <h3 className="fw-bold mb-4 text-center">Дізнатися більше</h3>
        <Row className="text-center">
          <Col md={4} className="mb-3 mb-md-0">
            <Link to="/about#about-us" className="text-decoration-none">
              <Button variant="outline-primary" className="w-100">Про нас</Button>
            </Link>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <Link to="/about#our-mission" className="text-decoration-none">
              <Button variant="outline-primary" className="w-100">Наша місія</Button>
            </Link>
          </Col>
          <Col md={4}>
            <Link to="/about#our-services" className="text-decoration-none">
              <Button variant="outline-primary" className="w-100">Послуги</Button>
            </Link>
          </Col>
        </Row>
      </Card>

      <Card className="p-4 shadow-sm border-0 bg-light">
        <h4 className="fw-bold mb-3 text-center">Чому саме TechMarket?</h4>
        <Row className="text-center">
          <Col md={3} className="mb-3">
            <div className="p-3">
              <div style={{ fontSize: '2rem' }}>⭐</div>
              <p className="fw-bold mb-1">Якість</p>
              <p className="text-secondary small">Кращі товари на ринку</p>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="p-3">
              <div style={{ fontSize: '2rem' }}>💰</div>
              <p className="fw-bold mb-1">Ціна</p>
              <p className="text-secondary small">Справедливі ціни для всіх</p>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="p-3">
              <div style={{ fontSize: '2rem' }}>🚀</div>
              <p className="fw-bold mb-1">Швидкість</p>
              <p className="text-secondary small">Оперативна доставка</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="p-3">
              <div style={{ fontSize: '2rem' }}>👨‍💼</div>
              <p className="fw-bold mb-1">Сервіс</p>
              <p className="text-secondary small">Якісна підтримка 24/7</p>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}
