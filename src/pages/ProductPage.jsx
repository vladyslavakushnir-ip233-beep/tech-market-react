import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Alert, Form, Badge } from 'react-bootstrap';
import { fetchProductById, getComments, postComment, moderateComment, setProductDiscount } from '../api/api';
import { useAuth } from '../auth/AuthContext';

export default function ProductPage({ onAddToCart }) {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [discountValue, setDiscountValue] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchProductById(id)
      .then(p => {
        setProduct(p);
        setDiscountValue(p.discount ?? 0);
      })
      .catch(err => {
        console.error('Fetch product error:', err);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (id && token) {
      loadComments();
    }
  }, [id, token]);

  function loadComments() {
    getComments(id, token)
      .then(data => {
        console.log('Comments loaded:', data);
        setComments(data || []);
      })
      .catch(err => {
        console.error('Load comments error:', err);
        setComments([]);
      });
  }

  async function handlePost(e) {
    e.preventDefault();
    if (!user) return alert('Please login to post a comment');
    try {
      await postComment(id, { rating, comment: text }, token);
      setText('');
      setRating(5);
      loadComments();
    } catch (e) {
      alert(e.message || 'Failed to post');
    }
  }

  async function handleModerate(commentId, action) {
    try {
      await moderateComment(commentId, action, token);
      loadComments();
    } catch (e) {
      alert(e.message || 'Moderation failed');
    }
  }

  async function applyDiscount() {
    if (!user || user.role !== 'admin') return alert('Access denied');
    const d = Number(discountValue) || 0;
    try {
      await setProductDiscount(id, d, token);
      const p = await fetchProductById(id);
      setProduct(p);
      alert('Discount updated');
    } catch (e) { alert(e.message || 'Failed'); }
  }

  if (loading) return <Container className="my-5">Loading...</Container>;
  if (!product) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          <h3>Товар не знайдено</h3>
          <p>Виберіть товар з каталогу</p>
          <Link to="/products" className="btn btn-primary mt-2">Повернутись до каталогу</Link>
        </Alert>
      </Container>
    );
  }

  const handleAddToCart = () => {
    onAddToCart(product);
    alert('Товар додано в кошик!');
  };

  const price = Number(product.price || 0);
  const discount = Number(product.discount || 0);
  const finalPrice = discount > 0 ? (price * (1 - discount/100)).toFixed(2) : price.toFixed(2);

  return (
    <Container className="my-4">
      <Row className="g-4">
        <Col md={5}>
          <Card className="p-3 shadow-sm">
            <img src={product.image || 'https://via.placeholder.com/320'} alt={product.name} className="img-fluid" style={{ maxHeight: '320px', objectFit: 'contain' }} />
          </Card>
        </Col>

        <Col md={7}>
          <Card className="p-4 shadow-sm">
            <h1 className="fw-bold mb-2">{product.name}</h1>

            {product.category && (<p className="text-secondary small"><strong>Категорія:</strong> {product.category}</p>)}

            <div className="mb-3">
              {discount > 0 ? (
                <div>
                  <span className="text-muted me-2"><s>{price.toFixed(2)} грн</s></span>
                  <span className="fs-4 text-danger">{finalPrice} грн</span>
                  <Badge bg="success" className="ms-2">-{discount}%</Badge>
                </div>
              ) : (
                <div className="fs-4">{price.toFixed(2)} грн</div>
              )}
            </div>

            {product.stock !== undefined && (
              <p className={`fw-bold ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>{product.stock > 0 ? `В наявності (${product.stock} шт)` : 'Немає в наявності'}</p>
            )}

            <p className="text-secondary fs-5 mb-4">{product.description || 'Опис товару відсутній'}</p>

            <Button variant="success" size="lg" onClick={handleAddToCart} disabled={product.stock === 0} className="mb-3">Додати в кошик</Button>
            <Link to="/products" className="btn btn-outline-secondary ms-2">Назад до каталогу</Link>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={7}>
          <h4>Коментарі</h4>
          {user ? (
            <Form onSubmit={handlePost} className="mb-3">
              <Form.Group className="mb-2">
                <Form.Label>Рейтинг</Form.Label>
                <Form.Control as="select" value={rating} onChange={e=>setRating(Number(e.target.value))}>
                  {[5,4,3,2,1].map(r=> <option key={r} value={r}>{r}</option>)}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Control placeholder="Ваш коментар" value={text} onChange={e=>setText(e.target.value)} />
              </Form.Group>
              <Button type="submit">Відправити</Button>
            </Form>
          ) : (
            <div className="mb-3">Щоб залишити коментар, увійдіть в акаунт.</div>
          )}

          <ListGroup>
            {comments.length === 0 && <div className="mb-2">Поки що немає коментарів</div>}
            {comments.map(c => (
              <ListGroup.Item key={c.id} className="d-flex justify-content-between align-items-start">
                <div>
                  <strong>{c.username || 'Користувач'}</strong> <span className="text-muted">{new Date(c.created_at).toLocaleString()}</span>
                  <div>Рейтинг: {c.rating}</div>
                  <div>{c.comment}</div>
                </div>
                {user?.role === 'admin' && (
                  <div>
                    <Button size="sm" variant="success" className="me-1" onClick={()=>handleModerate(c.id,'approve')}>Approve</Button>
                    <Button size="sm" variant="secondary" className="me-1" onClick={()=>handleModerate(c.id,'reject')}>Reject</Button>
                    <Button size="sm" variant="danger" onClick={()=>handleModerate(c.id,'delete')}>Delete</Button>
                  </div>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {user?.role === 'admin' && (
          <Col md={5}>
            <Card className="p-3">
              <h5>Адмін: Знижка на товар</h5>
              <div className="d-flex align-items-center">
                <input type="number" className="form-control me-2" value={discountValue} onChange={e=>setDiscountValue(e.target.value)} />
                <Button onClick={applyDiscount}>Застосувати</Button>
              </div>
            </Card>
          </Col>
        )}
      </Row>

      {/* Full Description */}
      {product.fullDescription && (
        <Card className="p-4 shadow-sm my-4">
          <h3 className="fw-bold mb-3">Детальний опис</h3>
          <p>{product.fullDescription}</p>
        </Card>
      )}

      {/* Characteristics */}
      {product.specs && product.specs.length > 0 && (
        <Card className="p-4 shadow-sm my-4">
          <h3 className="fw-bold mb-3">Характеристики</h3>
          <ListGroup>
            {product.specs.map((item, i) => (
              <ListGroup.Item key={i}>
                <strong>{item.name}:</strong> {item.value}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}
    </Container>
  );
}
