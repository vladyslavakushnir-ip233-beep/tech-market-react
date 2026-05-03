const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./shop.db');
const bcrypt = require('bcrypt');

async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`PRAGMA foreign_keys = ON;`);

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
        image TEXT,
        discount REAL DEFAULT 0
      );`);

      db.run(`CREATE TABLE IF NOT EXISTS suppliers (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        contact TEXT
      );`);

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

      db.run(`CREATE TABLE IF NOT EXISTS discounts (
        id INTEGER PRIMARY KEY,
        code TEXT,
        percent INTEGER,
        active INTEGER DEFAULT 1
      );`, (err) => {
        if (err) {
          console.error('Error creating tables:', err);
          reject(err);
          return;
        }
        
        seedAdmin();
      });
    });
  });
}

async function seedAdmin() {
  const adminEmail = 'admin@techmarket.local';
  
  db.get('SELECT id FROM users WHERE email = ?', [adminEmail], async (err, row) => {
    if (err) {
      console.error('Error checking admin:', err);
      db.close();
      return;
    }
    
    if (!row) {
      try {
        const hashed = await bcrypt.hash('Admin@123', 10);
        db.run('INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)', 
          ['Admin', adminEmail, hashed, 'admin'], 
          (err) => {
            if (err) {
              console.error('Error creating admin:', err);
            } else {
              console.log('✓ Seed admin created: admin@techmarket.local / Admin@123');
            }
            seedProducts();
          });
      } catch (e) {
        console.error('Error hashing password:', e);
        seedProducts();
      }
    } else {
      console.log('✓ Admin already exists');
      seedProducts();
    }
  });
}

function seedProducts() {
  const products = [
    { name: 'Холодильник Samsung', description: 'Двокамерний холодильник 350л', price: 8999, stock: 5, category: 'kitchen', image: 'https://mobileimages.lowes.com/productimages/aa8ab639-2b96-4c68-8b14-9bff65710d21/64450001.jpg' },
    { name: 'Пральна машина Bosch', description: 'Автоматична пральна машина 7кг', price: 7499, stock: 3, category: 'home', image: 'https://media3.bsh-group.com/Product_Shots/5120x/25248750_WGB256A2GB_STP_def.webp' },
    { name: 'Мікрохвильова піч LG', description: 'Мікрохвильова піч 25л', price: 2499, stock: 10, category: 'kitchen', image: 'https://www.thebrick.com/cdn/shop/files/shopify-image_da24399b-dd6c-4514-9d7c-11fe8e675f5e_1500x.jpg?v=1718898455' },
    { name: 'Кондиціонер Daikin', description: 'Кондиціонер 12000 BTU', price: 5999, stock: 2, category: 'climate', image: 'https://daikin-ukraine.com/upload/shop_1/7/8/9/item_7899/daikin-ftxn50-rxn50.jpg' },
    { name: 'Пилосос Dyson', description: 'Бездротовий пилосос', price: 12999, stock: 1, category: 'home', image: 'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/443096-01.png?' },
  ];

  db.get('SELECT COUNT(*) as count FROM products', (err, result) => {
    if (err || result.count > 0) {
      console.log('✓ Products already seeded or error occurred');
      closeDB();
      return;
    }

    const stmt = db.prepare('INSERT INTO products(name,description,price,stock,category,image) VALUES(?,?,?,?,?,?)');
    products.forEach(p => {
      stmt.run(p.name, p.description, p.price, p.stock, p.category, p.image);
    });
    stmt.finalize(() => {
      console.log('✓ Products seeded');
      closeDB();
    });
  });
}

function closeDB() {
  db.close(() => {
    console.log('✓ Database initialization complete!');
  });
}

initializeDatabase().catch(err => {
  console.error('Initialization failed:', err);
  db.close();
});




