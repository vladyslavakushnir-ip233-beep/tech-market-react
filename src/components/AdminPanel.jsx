import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table, Form, Alert, Modal } from "react-bootstrap";
import { useAuth } from "../auth/AuthContext";
import { fetchProducts, createProduct, deleteProduct, updateProduct, setProductDiscount, getComments, moderateComment, getSuppliers, createSupplier, updateSupplier, deleteSupplier, getOrders } from "../api/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import "../styles/AdminPanel.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function AdminPanel() {
  const { token } = useAuth();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [discounts, setDiscounts] = useState({});
  const [allComments, setAllComments] = useState([]);
  const [orderStatus, setOrderStatus] = useState("new");

  const [newProd, setNewProd] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
    stock: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [newSupplier, setNewSupplier] = useState({ name: "", contact: "" });

  const [orders, setOrders] = useState([]);

  useEffect(() => { loadProducts(); }, []);
  useEffect(() => { if (tab === 'reviews') loadAllComments(); }, [tab]);
  useEffect(() => { if (tab === 'suppliers') loadSuppliers(); }, [tab]);
  useEffect(() => { if (tab === 'orders') loadOrders(); }, [tab]);

  async function loadProducts(){
    setLoading(true);
    try{
      const data = await fetchProducts();
      setProducts(data || []);
      const map = {};
      (data || []).forEach(p => map[p.id] = p.discount || 0);
      setDiscounts(map);
    }catch(err){
      console.error(err);
      setMessage({ type: 'danger', text: 'Помилка завантаження товарів' });
    }finally{ setLoading(false); }
  }

  async function removeProduct(id){
    if (!window.confirm('Ви впевнені?')) return;
    try{ await deleteProduct(id, token); setProducts(prev => prev.filter(p=>p.id!==id)); setMessage({type:'success', text:'Товар видалено'}); }
    catch(e){ setMessage({type:'danger', text: e.message}); }
  }

  async function addProduct(){
    if (!newProd.name || !newProd.price || !newProd.category){ setMessage({type:'warning', text:'Заповніть обов\'язкові поля'}); return; }
    try{
      const productData = { name: newProd.name, price: Number(newProd.price), stock: Number(newProd.stock)||0, category: newProd.category, image: newProd.image||'', description: newProd.description||'' };
      if (editing){ await updateProduct(editing, productData, token); await loadProducts(); setEditing(null); setMessage({type:'success', text:'Товар оновлено'}); }
      else { const res = await createProduct(productData, token); setProducts(prev => [...prev, res]); setMessage({type:'success', text:'Товар додано'}); }
      setNewProd({ name:'', price:'', category:'', image:'', description:'', stock:'' });
    }catch(e){ setMessage({type:'danger', text: e.message}); }
  }

  function startEdit(product){ setEditing(product.id); setNewProd({ name: product.name, price: String(product.price), category: product.category||'', image: product.image||'', description: product.description||'', stock: String(product.stock||0) }); }
  function cancelEdit(){ setEditing(null); setNewProd({ name:'', price:'', category:'', image:'', description:'', stock:'' }); }
  function openImageModal(url){ setSelectedImage(url); setShowImageModal(true); }
  function changeOrderStatus(s){ setOrderStatus(s); setMessage({type:'success', text:`Статус змінено: ${s}`}); }

  const totalStockValue = products.reduce((s,p)=> s + (p.price*(p.stock||0)), 0);
  const categoryCount = {}; products.forEach(p => categoryCount[p.category||'Інше'] = (categoryCount[p.category||'Інше']||0)+1);

  async function loadAllComments() {
    try {
      const allCom = [];
      for (const p of products) {
        const rows = await getComments(p.id, token);
        allCom.push(...(rows || []).map(c => ({ ...c, product_name: p.name, product_id: p.id })));
      }
      setAllComments(allCom);
    } catch (e) {
      console.error(e);
      setAllComments([]);
    }
  }

  async function handleModerateReview(commentId, action) {
    try {
      await moderateComment(commentId, action, token);
      await loadAllComments();
    } catch (e) {
      console.error(e);
    }
  }

  async function loadSuppliers() {
    try {
      const data = await getSuppliers();
      setSuppliers(data || []);
    } catch (e) {
      console.error(e);
      setMessage({ type: 'danger', text: 'Помилка завантаження постачальників' });
    }
  }

  async function addSupplier() {
    if (!newSupplier.name || !newSupplier.contact) {
      setMessage({ type: 'warning', text: 'Заповніть усі поля' });
      return;
    }
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier, newSupplier, token);
        await loadSuppliers();
        setEditingSupplier(null);
        setMessage({ type: 'success', text: 'Постачальник оновлено' });
      } else {
        const res = await createSupplier(newSupplier, token);
        setSuppliers(prev => [...prev, res]);
        setMessage({ type: 'success', text: 'Постачальник додано' });
      }
      setNewSupplier({ name: "", contact: "" });
    } catch (e) {
      setMessage({ type: 'danger', text: e.message });
    }
  }

  async function removeSupplier(id) {
    if (!window.confirm('Ви впевнені?')) return;
    try {
      await deleteSupplier(id, token);
      setSuppliers(prev => prev.filter(s => s.id !== id));
      setMessage({ type: 'success', text: 'Постачальник видалено' });
    } catch (e) {
      setMessage({ type: 'danger', text: e.message });
    }
  }

  function startEditSupplier(supplier) {
    setEditingSupplier(supplier.id);
    setNewSupplier({ name: supplier.name, contact: supplier.contact });
  }

  function cancelEditSupplier() {
    setEditingSupplier(null);
    setNewSupplier({ name: "", contact: "" });
  }

  async function loadOrders() {
    try {
      const data = await getOrders(token);
      setOrders(data || []);
    } catch (e) {
      console.error(e);
      setMessage({ type: 'danger', text: 'Помилка завантаження замовлень' });
    }
  }

  return (
    <div className="admin-panel">
      <Container className="my-4">
        <h1 className="fw-bold mb-4">Адмін-панель</h1>

        {message && <Alert variant={message.type} onClose={()=>setMessage(null)} dismissible className="mb-3">{message.text}</Alert>}
        {loading && <Alert variant="info">Завантаження...</Alert>}

        <Row className="mb-4">
          <Col>
            <Button variant={tab==='products'?'primary':'outline-primary'} className="me-2" onClick={()=>setTab('products')}>Товари ({products.length})</Button>
            <Button variant={tab==='discounts'?'primary':'outline-primary'} className="me-2" onClick={()=>setTab('discounts')}>Знижки</Button>
            <Button variant={tab==='reviews'?'primary':'outline-primary'} className="me-2" onClick={()=>setTab('reviews')}>Відгуки</Button>
            <Button variant={tab==='orders'?'primary':'outline-primary'} className="me-2" onClick={()=>setTab('orders')}>Замовлення</Button>
            <Button variant={tab==='suppliers'?'primary':'outline-primary'} className="me-2" onClick={()=>setTab('suppliers')}>Постачальники</Button>
            <Button variant={tab==='stats'?'primary':'outline-primary'} onClick={()=>setTab('stats')}>Статистика</Button>
          </Col>
        </Row>

        {tab==='products' && (
          <Card className="p-4 shadow-sm">
            <h3 className="fw-bold mb-3">Управління товарами</h3>
            {products.length===0 ? <p className="text-secondary">Товарів ще немає.</p> : (
              <div className="table-responsive mb-4">
                <Table bordered hover size="sm">
                  <thead>
                    <tr><th>Назва</th><th>Ціна</th><th>Категорія</th><th>На складі</th><th>Зображення</th><th>Дія</th></tr>
                  </thead>
                  <tbody>
                    {products.map(p=> (
                      <tr key={p.id}>
                        <td><strong>{p.name}</strong></td>
                        <td>{p.price} грн</td>
                        <td>{p.category||'-'}</td>
                        <td>{p.stock||0} шт</td>
                        <td>
                          {p.image && <img src={p.image} alt={p.name} style={{maxWidth:40, maxHeight:40, cursor:'pointer'}} onClick={()=>openImageModal(p.image)} />}
                        </td>
                        <td>
                          <div className="d-flex">
                            <Button variant="warning" size="sm" className="me-2" onClick={()=>startEdit(p)}>✎</Button>
                            <Button variant="danger" size="sm" onClick={()=>removeProduct(p.id)}>🗑️</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}

            <Card className="p-3 bg-light mt-4">
              <h5 className="fw-bold mb-3">{editing? 'Редагувати товар':'Додати новий товар'}</h5>
              <Row className="g-2">
                <Col md={4}><Form.Control placeholder="Назва товару *" value={newProd.name} onChange={e=>setNewProd({...newProd, name:e.target.value})} /></Col>
                <Col md={2}><Form.Control type="number" placeholder="Ціна *" value={newProd.price} onChange={e=>setNewProd({...newProd, price:e.target.value})} /></Col>
                <Col md={2}><Form.Select value={newProd.category} onChange={e=>setNewProd({...newProd, category:e.target.value})}><option value="">Виберіть категорію</option><option value="kitchen">Кухонна техніка</option><option value="home">Техніка для дому</option><option value="climate">Кліматична техніка</option><option value="smart">Смарт-пристрої</option></Form.Select></Col>
                <Col md={4}><Form.Control placeholder="URL зображення" value={newProd.image} onChange={e=>setNewProd({...newProd, image:e.target.value})} /></Col>
              </Row>
              <Row className="g-2 mt-2">
                <Col md={6}><Form.Control placeholder="Опис" value={newProd.description} onChange={e=>setNewProd({...newProd, description:e.target.value})} /></Col>
                <Col md={2}><Form.Control type="number" placeholder="На складі" value={newProd.stock} onChange={e=>setNewProd({...newProd, stock:e.target.value})} /></Col>
                <Col md={4}><Button variant="success" className="w-100" onClick={addProduct}>{editing? 'Зберегти':'Додати товар'}</Button>{editing && <Button variant="secondary" className="w-100 mt-2" onClick={cancelEdit}>Скасувати</Button>}</Col>
              </Row>
            </Card>
          </Card>
        )}

        {tab==='discounts' && (
          <Card className="p-4 shadow-sm">
            <h3 className="fw-bold mb-3">Управління знижками</h3>
            {products.length===0 ? <p className="text-secondary">Товарів ще немає.</p> : (
              <div className="table-responsive">
                <Table bordered hover size="sm">
                  <thead>
                    <tr><th>Назва товару</th><th>Базова ціна</th><th>Знижка %</th><th>Ціна зі знижкою</th><th>Дія</th></tr>
                  </thead>
                  <tbody>
                    {products.map(p=> {
                      const disc = Number(discounts[p.id] || 0);
                      const finalPrice = p.price * (1 - disc/100);
                      return (
                        <tr key={p.id}>
                          <td><strong>{p.name}</strong></td>
                          <td>{p.price} грн</td>
                          <td>
                            <input type="number" className="form-control form-control-sm" style={{width:80}} value={discounts[p.id] ?? 0}
                              onChange={e=>setDiscounts(prev=>({...prev, [p.id]: e.target.value}))} min={0} max={100} />
                          </td>
                          <td className="fw-bold text-success">{finalPrice.toFixed(2)} грн</td>
                          <td><Button size="sm" variant="success" onClick={async ()=>{ await setProductDiscount(p.id, Number(discounts[p.id]||0), token); await loadProducts(); }}>Застосувати</Button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          </Card>
        )}

        {tab==='reviews' && (
          <Card className="p-4 shadow-sm">
            <h3 className="fw-bold mb-3">Модерація відгуків</h3>
            {allComments.length===0 ? <p className="text-secondary">Відгуків немає.</p> : (
              <ul className="list-group">
                {allComments.map(c=> (
                  <li key={c.id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-2">
                          <strong className="me-3">{c.username || 'Користувач'}</strong>
                          <span className="badge bg-info me-2">{c.product_name}</span>
                          {c.approved ? <span className="badge bg-success">Затверджено</span> : <span className="badge bg-warning">На модерацію</span>}
                        </div>
                        <p className="text-muted small mb-2">{new Date(c.created_at).toLocaleString('uk-UA')}</p>
                        <p>{c.comment}</p>
                      </div>
                      <div className="d-flex flex-column ms-3">
                        {!c.approved && <Button size="sm" variant="success" className="mb-2" onClick={()=>handleModerateReview(c.id, 'approve')}>Затвердити</Button>}
                        <Button size="sm" variant="danger" onClick={()=>handleModerateReview(c.id, 'delete')}>Видалити</Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {tab==='orders' && (
          <Card className="p-4 shadow-sm">
            <h3 className="fw-bold mb-3">Останні замовлення</h3>
            {orders.length===0 ? <p className="text-secondary">Замовлень немає.</p> : (
              <div className="table-responsive">
                <Table bordered hover size="sm">
                  <thead>
                    <tr><th>ID</th><th>Клієнт</th><th>Email</th><th>Сума</th><th>Статус</th><th>Дата</th></tr>
                  </thead>
                  <tbody>
                    {orders.map(o=> (
                      <tr key={o.id}>
                        <td><strong>#{o.id}</strong></td>
                        <td>{o.customer_name || 'N/A'}</td>
                        <td>{o.customer_email || 'N/A'}</td>
                        <td className="fw-bold text-success">{o.total.toFixed(2)} грн</td>
                        <td><span className={`badge ${o.status === 'completed' ? 'bg-success' : o.status === 'cancelled' ? 'bg-danger' : 'bg-warning'}`}>{o.status}</span></td>
                        <td>{new Date(o.created_at).toLocaleString('uk-UA')}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card>
        )}

        {tab==='suppliers' && (
          <Card className="p-4 shadow-sm">
            <h3 className="fw-bold mb-3">Управління постачальниками</h3>
            {suppliers.length===0 ? <p className="text-secondary">Постачальників ще немає.</p> : (
              <div className="table-responsive mb-4">
                <Table bordered hover size="sm">
                  <thead>
                    <tr><th>Назва</th><th>Контакт</th><th>Дія</th></tr>
                  </thead>
                  <tbody>
                    {suppliers.map(s=> (
                      <tr key={s.id}>
                        <td><strong>{s.name}</strong></td>
                        <td>{s.contact}</td>
                        <td>
                          <div className="d-flex">
                            <Button variant="warning" size="sm" className="me-2" onClick={()=>startEditSupplier(s)}>✎</Button>
                            <Button variant="danger" size="sm" onClick={()=>removeSupplier(s.id)}>🗑️</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}

            <Card className="p-3 bg-light mt-4">
              <h5 className="fw-bold mb-3">{editingSupplier ? 'Редагувати постачальника' : 'Додати нового постачальника'}</h5>
              <Row className="g-2">
                <Col md={5}><Form.Control placeholder="Назва постачальника *" value={newSupplier.name} onChange={e=>setNewSupplier({...newSupplier, name:e.target.value})} /></Col>
                <Col md={5}><Form.Control placeholder="Контакт (телефон, email) *" value={newSupplier.contact} onChange={e=>setNewSupplier({...newSupplier, contact:e.target.value})} /></Col>
                <Col md={2}><Button variant="success" className="w-100" onClick={addSupplier}>{editingSupplier ? 'Зберегти' : 'Додати'}</Button>{editingSupplier && <Button variant="secondary" className="w-100 mt-2" onClick={cancelEditSupplier}>Скасувати</Button>}</Col>
              </Row>
            </Card>
          </Card>
        )}

        {tab==='stats' && (
          <Card className="p-4 shadow-sm">
            <h3 className="fw-bold mb-3">Статистика</h3>
            
            {/* Main KPIs */}
            <Row className="mb-4">
              <Col md={3}><Card className="p-3 text-center bg-light shadow-sm"><h4 className="fw-bold text-primary">{products.length}</h4><p className="text-secondary">Товарів</p></Card></Col>
              <Col md={3}><Card className="p-3 text-center bg-light shadow-sm"><h4 className="fw-bold text-warning">{products.reduce((s,p)=>s+(p.stock||0),0)}</h4><p className="text-secondary">Одиниці на складі</p></Card></Col>
              <Col md={3}><Card className="p-3 text-center bg-light shadow-sm"><h4 className="fw-bold text-success">{totalStockValue.toFixed(0)} грн</h4><p className="text-secondary">Вартість запасів</p></Card></Col>
              <Col md={3}><Card className="p-3 text-center bg-light shadow-sm"><h4 className="fw-bold text-info">{orders.length}</h4><p className="text-secondary">Замовлень</p></Card></Col>
            </Row>

            {/* Charts */}
            <Row className="g-4">
              <Col lg={6}>
                <Card className="p-3 bg-light shadow-sm">
                  <h5 className="fw-bold mb-3">📊 Розподіл товарів по категоріям</h5>
                  <div style={{position:'relative', height:300}}>
                    <Pie 
                      data={{
                        labels:Object.keys(categoryCount), 
                        datasets:[{
                          label:'Товари', 
                          data:Object.values(categoryCount), 
                          backgroundColor:['#6366f1','#ec4899','#10b981','#0ea5e9','#f59e0b'], 
                          borderColor:'white', 
                          borderWidth:2
                        }]
                      }} 
                      options={{
                        responsive:true, 
                        maintainAspectRatio:false, 
                        plugins:{
                          legend:{position:'bottom'},
                          tooltip:{callbacks:{label:(ctx)=>`${ctx.label}: ${ctx.parsed} товарів`}}
                        }
                      }}
                    />
                  </div>
                </Card>
              </Col>

              <Col lg={6}>
                <Card className="p-3 bg-light shadow-sm">
                  <h5 className="fw-bold mb-3">📈 Кількість товарів по категоріям</h5>
                  <div style={{position:'relative', height:300}}>
                    <Bar 
                      data={{
                        labels:Object.keys(categoryCount), 
                        datasets:[{
                          label:'Кількість', 
                          data:Object.values(categoryCount), 
                          backgroundColor:'#6366f1',
                          borderColor:'#4f46e5',
                          borderWidth:1
                        }]
                      }} 
                      options={{
                        responsive:true, 
                        maintainAspectRatio:false, 
                        plugins:{
                          legend:{position:'bottom'}
                        },
                        scales:{
                          y:{beginAtZero:true}
                        }
                      }}
                    />
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Additional stats */}
            <Row className="g-4 mt-2">
              <Col md={6}>
                <Card className="p-3 bg-light shadow-sm">
                  <h5 className="fw-bold mb-3">💰 Інформація про товари</h5>
                  <div>
                    <p><strong>Найдорожий товар:</strong> {products.length > 0 ? `${products.reduce((a,b)=>a.price>b.price?a:b).name} (${products.reduce((a,b)=>a.price>b.price?a:b).price} грн)` : 'N/A'}</p>
                    <p><strong>Найдешевший товар:</strong> {products.length > 0 ? `${products.reduce((a,b)=>a.price<b.price?a:b).name} (${products.reduce((a,b)=>a.price<b.price?a:b).price} грн)` : 'N/A'}</p>
                    <p><strong>Середня ціна:</strong> {products.length > 0 ? `${(products.reduce((s,p)=>s+p.price,0)/products.length).toFixed(2)} грн` : 'N/A'}</p>
                    <p><strong>Найбільше на складі:</strong> {products.length > 0 ? `${products.reduce((a,b)=>(a.stock||0)>(b.stock||0)?a:b).name} (${products.reduce((a,b)=>(a.stock||0)>(b.stock||0)?a:b).stock} шт)` : 'N/A'}</p>
                  </div>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="p-3 bg-light shadow-sm">
                  <h5 className="fw-bold mb-3">📦 Статус запасів</h5>
                  <div>
                    <p><strong>Товари в наявності:</strong> {products.filter(p=>p.stock>0).length} / {products.length}</p>
                    <p><strong>Товари на вичерпанні:</strong> {products.filter(p=>p.stock>0 && p.stock<=3).length} товарів</p>
                    <p><strong>Товари відсутні:</strong> {products.filter(p=>p.stock===0 || !p.stock).length} товарів</p>
                    <p><strong>З дисконтами:</strong> {products.filter(p=>p.discount>0).length} товарів</p>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        )}

        <Modal show={showImageModal} onHide={()=>setShowImageModal(false)} centered size="lg"><Modal.Header closeButton><Modal.Title>Перегляд зображення</Modal.Title></Modal.Header><Modal.Body className="text-center">{selectedImage && <img src={selectedImage} alt="Product" style={{maxWidth:'100%', maxHeight:600, objectFit:'contain'}}/>}</Modal.Body></Modal>
      </Container>
    </div>
  );
}
