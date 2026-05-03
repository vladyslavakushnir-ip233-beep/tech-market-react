import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Container className="my-4">
      <Card className="p-5 mb-4 shadow-lg border-0 hero-card">
        <Row className="align-items-center">
          <Col md={7}>
            <h1 className="fw-bold display-5 mb-3">
              Інтернет-магазин побутової техніки «TechMarket»
            </h1>
            <p className="fs-5 text-secondary">
              Ми спеціалізуємося на сучасній техніці для дому, кухні та офісу. 
              Понад 5000 товарів у наявності, прямі поставки від виробників, 
              офіційна гарантія, швидка доставка по всій Україні.
            </p>
            <Button variant="primary" size="lg" as={Link} to="/products">
              Перейти до каталогу
            </Button>
          </Col>

          <Col md={5} className="text-center d-none d-md-block">
            <img
              src="https://etimg.etb2bimg.com/thumb/msid-94146979,width-1200,height-900,resizemode-4/.jpg"
              alt="Техніка для дому"
              className="img-fluid"
              style={{ maxHeight: "260px" }}
            />
          </Col>
        </Row>
      </Card>

      {/* Benefits */}
      <h2 className="mb-3 fw-bold">Чому обирають нас?</h2>
      <Row className="g-4 mb-5">
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h4 className="fw-bold mb-3">Офіційні постачальники</h4>
              <p>
                Ми співпрацюємо тільки з перевіреними брендами: Samsung, Philips, 
                Bosch, Xiaomi, LG, Electrolux та іншими. Вся техніка — оригінальна 
                та має сертифікацію.
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h4 className="fw-bold mb-3">Швидка доставка</h4>
              <p>
                Відправляємо в день замовлення. Доставка Новою Поштою, Укрпоштою 
                або курʼєром по місту. Можливий самовивіз зі складу.
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h4 className="fw-bold mb-3">Гарантія та сервіс</h4>
              <p>
                Офіційна гарантія від 12 до 36 місяців. Підтримка клієнтів, 
                консультації та можливість повернення протягом 14 днів.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* About store */}
      <Card className="p-4 shadow-sm mb-4">
        <h2 className="fw-bold mb-3">Про наш магазин</h2>
        <p>
          «TechMarket» працює на ринку побутової техніки понад 7 років. 
          Ми створили зручну та надійну платформу для покупки техніки онлайн, 
          щоб наші клієнти могли швидко обирати, порівнювати та замовляти 
          необхідні товари.
        </p>
        <p>
          У нас ви знайдете все: холодильники, пральні машини, пилососи, 
          кавомашини, мікрохвильові печі, бойлери, мультиварки, електрочайники, 
          смартфони, ноутбуки, телевізори та іншу техніку для дому.
        </p>
      </Card>

      {/* Guarantee */}
      <Card className="p-4 shadow-sm">
        <h2 className="fw-bold mb-3">Наші гарантії</h2>
        <ul className="fs-5">
          <li>Офіційні гарантійні талони від виробників</li>
          <li>Можливість повернення або обміну протягом 14 днів</li>
          <li>Передпродажна перевірка техніки на складі</li>
          <li>Зручні способи оплати: готівка, картка, післяплата</li>
          <li>Прозоре відстеження статусу замовлення</li>
        </ul>
      </Card>
    </Container>
  );
}
