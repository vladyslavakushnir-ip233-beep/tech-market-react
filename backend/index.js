require('dotenv').config();

// Імпорт бібліотек для сервера, БД, шифрування та авторизації
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const https = require('https');
const crypto = require('crypto');
const path = require('path');

// Налаштування Express сервера
const app = express();
app.use(cors()); // Дозволяє запити з браузера
app.use(express.json()); // Парсить JSON з тіла запитів

// Шлях до файлу БД
const DB_PATH = path.join(__dirname, process.env.DB_PATH || 'shop.db');
const db = new sqlite3.Database(DB_PATH);

// Налаштування для bcrypt та JWT
const SALT_ROUNDS = 10;
const TOKEN_EXPIRES = '144d';

// Ініціалізація бази даних: створення таблиць та початкових даних
db.serialize(() => {
  db.run(`PRAGMA foreign_keys = ON;`); // Вмикає перевірку зв'язків між таблицями

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    category TEXT,
    image TEXT
  );`);

  db.get("PRAGMA table_info(products)", (err, info) => {
  });

  db.run(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    address TEXT
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    total REAL,
    status TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(customer_id) REFERENCES customers(id)
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    qty INTEGER,
    price REAL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY,
    product_id INTEGER,
    user_id INTEGER,
    username TEXT,
    rating INTEGER DEFAULT 0,
    comment TEXT,
    approved INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id)
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT
  );`);

  db.all("PRAGMA table_info(products)", (err, cols) => {
    if (!err && Array.isArray(cols)) {
      const hasDiscount = cols.some(c => c.name === 'discount');
      if (!hasDiscount) {
        db.run(`ALTER TABLE products ADD COLUMN discount REAL DEFAULT 0`, e=>{
          if (e) console.log('Could not add discount column:', e.message);
        });
      }
    }
    // Seed products if table is empty
    db.get('SELECT COUNT(*) as count FROM products', (err, result) => {
      if (!err && result && result.count === 0) {
        const products = [
          { name: 'Холодильник Samsung', description: 'Двокамерний холодильник 350л', price: 8999, stock: 5, category: 'kitchen', image: 'https://mobileimages.lowes.com/productimages/aa8ab639-2b96-4c68-8b14-9bff65710d21/64450001.jpg' },
          { name: 'Пральна машина Bosch', description: 'Автоматична пральна машина 7кг', price: 7499, stock: 3, category: 'home', image: 'https://media3.bsh-group.com/Product_Shots/5120x/25248750_WGB256A2GB_STP_def.webp' },
          { name: 'Мікрохвильова піч LG', description: 'Мікрохвильова піч 25л', price: 2499, stock: 10, category: 'kitchen', image: 'https://www.thebrick.com/cdn/shop/files/shopify-image_da24399b-dd6c-4514-9d7c-11fe8e675f5e_1500x.jpg?v=1718898455' },
          { name: 'Кондиціонер Daikin', description: 'Кондиціонер 12000 BTU', price: 5999, stock: 2, category: 'climate', image: 'https://daikin-ukraine.com/upload/shop_1/7/8/9/item_7899/daikin-ftxn50-rxn50.jpg' },
          { name: 'Пилосос Dyson', description: 'Бездротовий пилосос', price: 12999, stock: 1, category: 'home', image: 'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/443096-01.png?' },
        ];
        const stmt = db.prepare('INSERT INTO products(name,description,price,stock,category,image,discount) VALUES(?,?,?,?,?,?,?)');
        products.forEach(p => {
          stmt.run(p.name, p.description, p.price, p.stock, p.category, p.image, 0);
        });
        stmt.finalize(() => {
          console.log('✓ Products seeded');
        });
      }
    });
  });

  // Ensure reviews table has approved column
  db.all("PRAGMA table_info(reviews)", (err, cols) => {
    if (!err && Array.isArray(cols)) {
      const hasApproved = cols.some(c => c.name === 'approved');
      if (!hasApproved) {
        db.run(`ALTER TABLE reviews ADD COLUMN approved INTEGER DEFAULT 0`, e=>{
          if (e) console.log('Could not add approved column to reviews:', e.message);
          else console.log('✓ Added approved column to reviews');
        });
      }
      const hasUsername = cols.some(c => c.name === 'username');
      if (!hasUsername) {
        db.run(`ALTER TABLE reviews ADD COLUMN username TEXT`, e=>{
          if (e) console.log('Could not add username column to reviews:', e.message);
          else console.log('✓ Added username column to reviews');
        });
      }
      const hasUserId = cols.some(c => c.name === 'user_id');
      if (!hasUserId) {
        db.run(`ALTER TABLE reviews ADD COLUMN user_id INTEGER`, e=>{
          if (e) console.log('Could not add user_id column to reviews:', e.message);
          else console.log('✓ Added user_id column to reviews');
        });
      }
    }

    // Ensure admin user exists
    db.get('SELECT id FROM users WHERE email = ?', ['admin@techmarket.local'], async (err, row) => {
      if (!err && !row) {
        try {
          const hashed = await bcrypt.hash('Admin@123', SALT_ROUNDS);
          db.run('INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)', 
            ['Admin', 'admin@techmarket.local', hashed, 'admin'], 
            (err) => {
              if (err) {
                console.error('Error creating admin:', err.message);
              } else {
                console.log('✓ Seed admin created: admin@techmarket.local / Admin@123');
              }
            });
        } catch (e) {
          console.error('Error hashing password:', e.message);
        }
      }
    });
  });
});

// Реєстрація нового користувача
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: "Missing fields" });

    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (row) return res.status(400).json({ error: "Email already registered" });

      const hashed = await bcrypt.hash(password, SALT_ROUNDS);
      const r = db.prepare('INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)');
      r.run(name, email, hashed, role || 'user', function(err) {
        if (err) return res.status(500).json({ error: err.message });
        const user = { id: this.lastID, name, email, role: role || 'user' };
        const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
        res.json({ user, token });
      });
      r.finalize();
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Звичайний логін
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  db.get('SELECT id,name,email,password,role FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, row.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const user = { id: row.id, name: row.name, email: row.email, role: row.role };
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
    res.json({ user, token });
  });
});

function verifyGoogleIdToken(idToken) {
  return new Promise((resolve, reject) => {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
    https.get(url, (resp) => {
      let data = '';
      resp.on('data', (chunk) => { data += chunk; });
      resp.on('end', () => {
        if (resp.statusCode !== 200) {
          return reject(new Error('Invalid Google token'));
        }
        try {
          const payload = JSON.parse(data);
          resolve(payload);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => reject(err));
  });
}

// Логін через Google OAuth
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ error: 'Missing Google credential' });

    const tokenInfo = await verifyGoogleIdToken(credential);
    const clientId = process.env.GOOGLE_CLIENT_ID || '77795586124-4303ngtn279tfh3q55c94d21o6lsar3d.apps.googleusercontent.com';
    if (tokenInfo.aud !== clientId) {
      return res.status(400).json({ error: 'Google token audience mismatch' });
    }
    if (tokenInfo.email_verified !== 'true' && tokenInfo.email_verified !== true) {
      return res.status(400).json({ error: 'Google email is not verified' });
    }

    const email = tokenInfo.email;
    const name = tokenInfo.name || email.split('@')[0];

    db.get('SELECT id,name,email,role FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      const handleUser = (user) => {
        const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
        res.json({ user, token });
      };

      if (row) {
        handleUser({ id: row.id, name: row.name, email: row.email, role: row.role });
      } else {
        const randomPassword = crypto.randomBytes(16).toString('hex');
        const hashed = await bcrypt.hash(randomPassword, SALT_ROUNDS);
        const stmt = db.prepare('INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)');
        stmt.run(name, email, hashed, 'user', function (err) {
          if (err) return res.status(500).json({ error: err.message });
          handleUser({ id: this.lastID, name, email, role: 'user' });
        });
        stmt.finalize();
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/auth/me', (req, res) => {
  // Перевірка поточного користувача за JWT токеном
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) return res.status(401).json({ error: "Not authenticated" });

  try {
    const payload = jwt.verify(auth, process.env.JWT_SECRET);
    res.json({ user: { id: payload.id, name: payload.name, role: payload.role } });
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.use((req,res,next)=>{ console.log(`[${new Date().toISOString()}]`, req.method, req.url); next(); });
 
// Middleware для перевірки авторизації (JWT токен)
function requireAuth(req, res, next){
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const payload = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Middleware для перевірки ролі адміністратора
function requireAdmin(req, res, next){
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const payload = jwt.verify(auth, process.env.JWT_SECRET);
    if (payload.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    req.user = payload;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// API ендпоінти для продуктів
// Отримання списку продуктів з пошуком
app.get('/api/products', (req,res)=>{
  const q = req.query.q || '';
  const sql = `SELECT * FROM products WHERE name LIKE ? LIMIT 100`;
  db.all(sql, [`%${q}%`], (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows || []);
  });
});

app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  console.log(`[GET /api/products/:id] Fetching product with id: ${id}`);
  db.get(`SELECT * FROM products WHERE id = ?`, [id], (err, product) => {
    if (err) {
      console.error(`[GET /api/products/:id] DB Error:`, err);
      return res.status(500).json({ error: err.message });
    }
    if (!product) {
      console.log(`[GET /api/products/:id] Product not found for id: ${id}`);
      return res.status(404).json({ error: 'Product not found' });
    }
    db.all(`SELECT * FROM reviews WHERE product_id = ? AND approved = 1 ORDER BY created_at DESC`, [id], (e, comments) => {
      if (e) {
        console.error(`[GET /api/products/:id] Comments Error:`, e);
        return res.status(500).json({ error: e.message });
      }
      product.comments = comments || [];
      console.log(`[GET /api/products/:id] Successfully fetched product:`, product.name);
      res.json(product);
    });
  });
});

app.get('/api/products/:id/comments', (req, res) => {
  const id = req.params.id;
  const auth = req.headers.authorization?.split(' ')[1];
  let isAdmin = false;
  let userId = null;
  if (auth) {
    try { 
      const p = jwt.verify(auth, process.env.JWT_SECRET); 
      isAdmin = p.role === 'admin';
      userId = p.id;
    } catch(e){}
  }
  
  let sql;
  let params;
  
  if (isAdmin) {
    // Admins see all comments
    sql = `SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC`;
    params = [id];
  } else if (userId) {
    // Regular users see approved comments + their own
    sql = `SELECT * FROM reviews WHERE product_id = ? AND (approved = 1 OR user_id = ?) ORDER BY created_at DESC`;
    params = [id, userId];
  } else {
    // Guests see only approved comments
    sql = `SELECT * FROM reviews WHERE product_id = ? AND approved = 1 ORDER BY created_at DESC`;
    params = [id];
  }
  
  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error(`[GET /api/products/:id/comments] Error:`, err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

app.post('/api/products/:id/comments', requireAuth, (req, res) => {
  const id = req.params.id;
  const { rating, comment } = req.body;
  const username = req.user.name || req.user.id;
  const userId = req.user.id;
  const approved = req.user.role === 'admin' ? 1 : 0;
  const stmt = db.prepare(`INSERT INTO reviews(product_id,user_id,username,rating,comment,approved) VALUES (?,?,?,?,?,?)`);
  stmt.run(id, userId, username, rating || 0, comment || '', approved, function(err){
    if (err) return res.status(500).json({ error: err.message });
    db.get(`SELECT * FROM reviews WHERE id = ?`, [this.lastID], (e,row)=>{
      if (e) return res.status(500).json({ error: e.message });
      res.json(row);
    });
  });
  stmt.finalize();
});

app.put('/api/comments/:id', requireAdmin, (req, res) => {
  const id = req.params.id;
  const { action } = req.body;
  if (action === 'delete') {
    db.run(`DELETE FROM reviews WHERE id = ?`, [id], function(err){
      if (err) return res.status(500).json({ error: err.message });
      return res.json({ ok: true });
    });
    return;
  }
  const approved = action === 'approve' ? 1 : 0;
  db.run(`UPDATE reviews SET approved = ? WHERE id = ?`, [approved, id], function(err){
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ok: true });
  });
});

app.put('/api/products/:id/discount', requireAdmin, (req, res) => {
  const id = req.params.id;
  const { discount } = req.body;
  if (discount == null) return res.status(400).json({ error: 'Missing discount' });
  db.run(`UPDATE products SET discount = ? WHERE id = ?`, [Number(discount) || 0, id], function(err){
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ok: true });
  });
});

app.post('/api/products', (req,res)=>{
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) return res.status(401).json({ error: "Not authenticated" });

  try {
    const payload = jwt.verify(auth, process.env.JWT_SECRET);
    if (payload.role !== 'admin') return res.status(403).json({ error: "Access denied" });
    
    const { name, description, price, stock, category, image } = req.body;
    if (!name || !price) return res.status(400).json({ error: "Missing required fields" });

    const stmt = db.prepare(`INSERT INTO products(name,description,price,stock,category,image) VALUES (?,?,?,?,?,?)`);
    stmt.run(name, description || '', Number(price), Number(stock) || 10, category || '', image || '', function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, description, price, stock, category, image });
    });
    stmt.finalize();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.delete('/api/products/:id', (req,res)=>{
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) return res.status(401).json({ error: "Not authenticated" });

  try {
    const payload = jwt.verify(auth, process.env.JWT_SECRET);
    if (payload.role !== 'admin') return res.status(403).json({ error: "Access denied" });
    
    const stmt = db.prepare(`DELETE FROM products WHERE id = ?`);
    stmt.run(req.params.id, function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    });
    stmt.finalize();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.put('/api/products/:id', (req,res)=>{
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) return res.status(401).json({ error: "Not authenticated" });

  try {
    const payload = jwt.verify(auth, process.env.JWT_SECRET);
    if (payload.role !== 'admin') return res.status(403).json({ error: "Access denied" });
    
    const { name, description, price, stock, category, image } = req.body;
    const stmt = db.prepare(`UPDATE products SET name=?, description=?, price=?, stock=?, category=?, image=? WHERE id=?`);
    stmt.run(name, description, Number(price), Number(stock), category, image, req.params.id, function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    });
    stmt.finalize();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Створення замовлення (транзакція для цілісності даних)
app.post('/api/orders', (req,res)=>{
  const {customer, items, total} = req.body;
  
  function rollback(err){
    db.run("ROLLBACK", ()=> res.status(500).json({error: err.message}));
  }
  
  db.serialize(()=>{
    db.run("BEGIN TRANSACTION");
    db.run(`INSERT OR IGNORE INTO customers(name,email,phone,address) VALUES (?,?,?,?)`,
      [customer.name, customer.email, customer.phone, customer.address]);
    db.get(`SELECT id FROM customers WHERE email = ?`, [customer.email], (err,row)=>{
      if (err) return rollback(err);
      const customerId = row.id;
      db.run(`INSERT INTO orders(customer_id,total,status) VALUES (?,?,?)`, [customerId,total,'new'], function(err){
        if (err) return rollback(err);
        const orderId = this.lastID;
        const stmt = db.prepare(`INSERT INTO order_items(order_id,product_id,qty,price) VALUES (?,?,?,?)`);
        items.forEach(it => stmt.run(orderId, it.product_id, it.qty, it.price));
        stmt.finalize(err=>{
          if (err) return rollback(err);
          db.run("COMMIT", ()=> res.json({ok:true,orderId}));
        });
      });
    });
  });
});

app.get('/api/orders', requireAdmin, (req,res)=>{
  // Отримання всіх замовлень для адміна
  db.all(`
    SELECT o.id, o.customer_id, o.total, o.status, o.created_at, c.name as customer_name, c.email as customer_email
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    ORDER BY o.created_at DESC
  `, (err,rows)=>{
    if (err) return res.status(500).json({error: err.message});
    res.json(rows || []);
  });
});

app.get('/api/orders/:id', requireAdmin, (req,res)=>{
  const orderId = req.params.id;
  db.get(`
    SELECT o.id, o.customer_id, o.total, o.status, o.created_at, c.name as customer_name, c.email as customer_email
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE o.id = ?
  `, [orderId], (err,order)=>{
    if (err) return res.status(500).json({error: err.message});
    if (!order) return res.status(404).json({error: 'Order not found'});
    db.all(`
      SELECT oi.id, oi.product_id, oi.qty, oi.price, p.name as product_name
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId], (e,items)=>{
      if (e) return res.status(500).json({error: e.message});
      order.items = items || [];
      res.json(order);
    });
  });
});

app.get('/api/suppliers', (req,res)=>{
  db.all('SELECT * FROM suppliers', (err,rows)=>{
    if (err) return res.status(500).json({error: err.message});
    res.json(rows || []);
  });
});

app.post('/api/suppliers', requireAdmin, (req,res)=>{
  const {name, contact} = req.body;
  if (!name) return res.status(400).json({error: 'Missing name'});
  const stmt = db.prepare(`INSERT INTO suppliers(name,contact) VALUES (?,?)`);
  stmt.run(name, contact||'', function(err){
    if (err) return res.status(500).json({error: err.message});
    res.json({id: this.lastID, name, contact: contact||''});
  });
  stmt.finalize();
});

app.put('/api/suppliers/:id', requireAdmin, (req,res)=>{
  const {name, contact} = req.body;
  const stmt = db.prepare(`UPDATE suppliers SET name=?, contact=? WHERE id=?`);
  stmt.run(name, contact||'', req.params.id, function(err){
    if (err) return res.status(500).json({error: err.message});
    res.json({ok: true});
  });
  stmt.finalize();
});

app.delete('/api/suppliers/:id', requireAdmin, (req,res)=>{
  const stmt = db.prepare(`DELETE FROM suppliers WHERE id=?`);
  stmt.run(req.params.id, function(err){
    if (err) return res.status(500).json({error: err.message});
    res.json({ok: true});
  });
  stmt.finalize();
});


// Запуск сервера на порту 4000 (або з .env)
const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`API listening on ${PORT}`));


