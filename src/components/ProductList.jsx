import { useState } from "react";
import { Container, Row, Col, Form, Card, Spinner } from "react-bootstrap";
import ProductCard from "../components/ProductCard";

export default function ProductList({ products = [], onAddToCart, loading = false }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price-asc");
  const [category, setCategory] = useState("all");

  const filtered = (products || [])
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) => (category === "all" ? true : p.category === category))
    .sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Завантаження товарів...</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h1 className="fw-bold mb-4">Каталог товарів</h1>

      {/* Filters */}
      <Card className="p-3 shadow-sm mb-4">
        <Row className="g-3">
          <Col md={4}>
            <Form.Control
              placeholder="Пошук товарів..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>

          <Col md={4}>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">Усі категорії</option>
              <option value="kitchen">Кухонна техніка</option>
              <option value="home">Техніка для дому</option>
              <option value="climate">Кліматична техніка</option>
              <option value="smart">Смарт-пристрої</option>
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="price-asc">Ціна: зростання</option>
              <option value="price-desc">Ціна: спадання</option>
              <option value="name-asc">Назва: A–Z</option>
              <option value="name-desc">Назва: Z–A</option>
            </Form.Select>
          </Col>
        </Row>
      </Card>

      {/* Product grid */}
      <Row className="g-4">
        {filtered.length === 0 && (
          <p className="text-center text-secondary fs-5">
            Нічого не знайдено за вашим запитом.
          </p>
        )}

        {filtered.map((product) => (
          <Col key={product.id} md={4} lg={3}>
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
