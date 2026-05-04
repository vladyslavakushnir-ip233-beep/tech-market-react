# TechMarket - Інтернет-магазин побутової техніки

Повнофункціональний MERNStack проект для розповсюдження побутової техніки з повною системою аутентифікації, управління кошиком, замовленнями та адміністраторської панелі зі статистикою.

## ✨ Основні Функції

### 👤 Для користувачів
- ✅ Реєстрація, вхід та вихід
- ✅ Перегляд каталогу товарів (5000+ позицій)
- ✅ Фільтрація та пошук по категоріям
- ✅ Додавання товарів у кошик з автозбереженням
- ✅ Оформлення замовлень
- ✅ Синхронізація кошика між пристроями
- ✅ Перегляд історії замовлень
- ✅ Коментарі та рейтинги товарів

### 🔧 Для адміністратора
- ✅ Управління каталогом (CRUD операції)
- ✅ Застосування знижок на товари
- ✅ Модерація коментарів користувачів
- ✅ Управління постачальниками
- ✅ Перегляд замовлень з деталями
- ✅ Інтерактивна статистика продажу
- ✅ Графіки та діаграми KPI

## 📁 Архітектура проекту

```
my-shop/
├── backend/                    # Node.js + Express сервер
│   ├── index.js               # REST API з 20+ endpoints
│   ├── db_init.js             # Ініціалізація SQLite БД
│   ├── package.json
│   ├── .env
│   └── shop.db                # Локальна база даних
│
├── src/                        # React Vite фронтенд
│   ├── api/
│   │   └── api.jsx            # API клієнт з 
│   │
│   ├── auth/
│   │   ├── AuthContext.jsx    # JWT управління станом
│   │   ├── ProtectedRoute.jsx # Захист маршрутів користувачів
│   │   ├── AdminRoute.jsx     # Захист адміністраторських маршрутів
│   │   ├── Login.jsx          # Екран входу
│   │   └── Register.jsx       # Екран реєстрації
│   │
│   ├── components/
│   │   ├── AdminPanel.jsx     # Панель управління з 6 вкладками
│   │   ├── ProductList.jsx    # Список товарів з фільтрацією
│   │   ├── ProductCard.jsx    # Карточка товару
│   │   ├── Cart.jsx           # Кошик користувача
│   │   ├── Checkout.jsx       # Оформлення замовлення
│   │   ├── Footer.jsx         # Футер сторінки
│   │   └── Header.jsx         # Навігація
│   │
│   ├── pages/
│   │   ├── Home.jsx           # Головна сторінка
│   │   ├── CartPage.jsx       # Сторінка кошика
│   │   ├── ProductPage.jsx    # Деталі товару + коментарі
│   │   ├── OrdersPage.jsx     # Історія замовлень
│   │   ├── Contacts.jsx       # Контактна інформація
│   │   └── OrderSuccess.jsx   # Підтвердження замовлення
│   │
│   ├── App.jsx                # Маршрутизація (React Router v7)
│   ├── main.jsx               # Entry point
│   └── index.css              # Глобальні стилі
│
├── tests/                      # 75 Unit/Integration тестів
│   ├── 1.auth.test.js         # Аутентифікація
│   ├── 2.product.test.js      # Керування товарами
│   ├── 3.cart.test.js         # Логіка кошика
│   ├── 4.order.test.js        # Замовлення
│   ├── 5.discount.test.js     # Знижки та ціни
│   ├── 6.reviews.test.js      # Коментарі та рейтинги
│   ├── 7.validation.test.js   # Валідація форм
│   ├── 8.permissions.test.js  # Контроль доступу
│   ├── 9.utils.test.js        # Утиліти та форматування
│   └── 10.analytics.test.js   # Аналітика та статистика
│
├── package.json               # Frontend залежності
├── vite.config.js            # Vite конфігурація
├── eslint.config.js          # Linting правила
├── SETUP.md                  # Цей файл
├── TESTS.md                  # Документація тестів
└── .env.local                # Локальні змінні
```

## 🚀 Швидкий старт

### Вимоги
- Node.js v18+ 
- npm v9+
- Git

### 1️⃣ Установка

```bash
# Клонування репозиторію
git clone https://github.com/yourusername/my-shop.git
cd my-shop

# Установка Frontend залежностей
npm install

# Установка Backend залежностей
cd backend
npm install
cd ..
```

### 2️⃣ Конфігурація

**Backend (`backend/.env`):**
```env
PORT=4000
JWT_SECRET=super_secret_key_change_in_production_please_12345
DB_PATH=./shop.db
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**Frontend (`.env.local`):**
```env
VITE_API_BASE=http://localhost:4000/api
```

### 3️⃣ Запуск

*npm run dev:all
```

### 4️⃣ Доступ до системи

Після запуску додатку:

**Таблиця користувачів:**

| Email | Пароль | Роль |
|-------|--------|------|
| `admin@techmarket.local` | `Admin@123` | 👨‍💼 Admin |
| `user@techmarket.local` | `User@123` | 👤 User |

**Тестова адреса:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api
- Admin Panel: http://localhost:5173/admin

## 📡 REST API Документація

### Аутентифікація

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: { token, user: { id, name, email, role } }
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@techmarket.local",
  "password": "Admin@123"
}

Response: { token, user }
```

```http
GET /api/auth/me
Authorization: Bearer {token}

Response: { user }
```

### Товари

```http
GET /api/products                    # Усі товари
GET /api/products?q=ноутбук         # Пошук
GET /api/products/:id               # Деталі товару
GET /api/products/:id/comments      # Коментарі товару

POST /api/products                  # Створити (Admin)
PUT /api/products/:id               # Оновити (Admin)
DELETE /api/products/:id            # Видалити (Admin)
PUT /api/products/:id/discount      # Застосувати знижку
```

### Замовлення

```http
GET /api/orders                     # Мої замовлення (User)
GET /api/orders                     # Усі замовлення (Admin)
GET /api/orders/:id                 # Деталі замовлення

POST /api/orders                    # Створити замовлення
Content-Type: application/json

{
  "items": [
    { "product_id": 1, "qty": 2, "price": 999.99 }
  ],
  "total": 1999.98,
  "customer": {
    "name": "John",
    "email": "john@example.com",
    "phone": "+380991234567",
    "address": "Kyiv, Ukraine"
  }
}
```

### Коментарі та Рейтинги

```http
GET /api/products/:id/comments      # Коментарі товару

POST /api/products/:id/comments     # Додати коментар
Content-Type: application/json

{
  "rating": 5,
  "comment": "Чудовий товар!"
}

PUT /api/comments/:id               # Модерація (Admin)
Content-Type: application/json

{
  "approved": true
}
```

### Постачальники (Admin)

```http
GET /api/suppliers                  # Список постачальників
POST /api/suppliers                 # Додати постачальника
PUT /api/suppliers/:id              # Оновити
DELETE /api/suppliers/:id           # Видалити
```

## 🗄️ Схема Бази Даних

### Таблиця `users`
```sql
users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL (bcrypt hash),
  role TEXT DEFAULT 'user' (admin|user),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Таблиця `products`
```sql
products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  category TEXT,
  image TEXT,
  discount INTEGER DEFAULT 0 (0-100%),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Таблиця `orders`
```sql
orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  total REAL NOT NULL,
  status TEXT DEFAULT 'pending' (pending|confirmed|shipped|delivered),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Таблиця `order_items`
```sql
order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  qty INTEGER NOT NULL,
  price REAL NOT NULL
)
```

### Таблиця `reviews`
```sql
reviews (
  id INTEGER PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  user_id INTEGER REFERENCES users(id),
  username TEXT,
  rating INTEGER (1-5),
  comment TEXT,
  approved INTEGER DEFAULT 0,
  created_at DATETIME
)
```

### Таблиця `suppliers`
```sql
suppliers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT
)
```

### Таблиця `discounts`
```sql
discounts (
  id INTEGER PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  percent INTEGER NOT NULL,
  created_at DATETIME
```

## 🔐 Безпека та Аутентифікація

### Шифрування пароля
- Всі паролі хешуються за допомогою **bcrypt** (12 rounds)
- Оригінальні паролі ніколи не зберігаються

### JWT токени
- Токени видаються при успішному вході
- Терміну дії: 7 днів
- Зберігаються в `localStorage`
- Передаються в заголовку: `Authorization: Bearer {token}`

### Контроль доступу
- `ProtectedRoute` - захист від не авторизованих користувачів
- `AdminRoute` - захист адміністраторських функцій
- Усі API endpoints перевіряють JWT токен
- Server-side валідація прав користувача

### CORS
- Налаштовано для `localhost:5173` (розробка)
- Production: змініть `CORS_ORIGIN` в `.env`

## 📦 Технологічний стек

### Frontend
- **React 19** - UI бібліотека
- **React Router v7** - SPA маршрутизація
- **React Bootstrap 2** - UI компоненти
- **Chart.js + react-chartjs-2** - Графіки та діаграми
- **Vite 7** - Build tool (замість Create React App)

### Backend
- **Express 5** - REST API фреймворк
- **SQLite3** - Вбудована база даних
- **jsonwebtoken** - JWT аутентифікація
- **bcrypt** - Шифрування пароля
- **CORS** - Cross-origin requests
- **dotenv** - Змінні середовища

## 🧪 Тестування

**75 Unit/Integration тестів:**

```bash
npm test
```

Покриває:
- ✅ Аутентифікацію та авторизацію
- ✅ CRUD операції товарів
- ✅ Логіку кошика
- ✅ Обробку замовлень
- ✅ Розрахунки знижок
- ✅ Систему коментарів
- ✅ Валідацію форм
- ✅ Контроль доступу
- ✅ Утиліти та форматування
- ✅ Аналітику та статистику

**Результат:** 75/75 ✅ всі тести пройшли

Дивіться `TESTS.md` для деталей.

## 📊 Адміністраторська панель

6 вкладок управління:

### 1. **Products** - Управління каталогом
- Список всіх товарів
- Додавання нових (з картинкою)
- Редагування деталей
- Видалення товарів
- Пошук та фільтрація

### 2. **Discounts** - Знижки та акції
- Застосування відсоткових знижок
- Булькові операції
- Історія змін
- Видалення знижок

### 3. **Reviews** - Модерація коментарів
- Список всіх коментарів
- Перегляд рейтингу
- Затвердження/відхилення
- Видалення спаму

### 4. **Orders** - Управління замовленнями
- Таблиця всіх замовлень
- Фільтрація по статусу
- Редагування статусу
- Експорт звітів

### 5. **Suppliers** - Управління постачальниками
- Список постачальників
- Додавання нових
- Редагування контактів
- Видалення

### 6. **Statistics** - Аналітика та KPI
- **4 KPI карточки**: товари, запаси, вартість, замовлення
- **Pie Chart**: розподіл по категоріям (інтерактивна)
- **Bar Chart**: кількість товарів по категоріям
- **Інформаційні карточки**: найдорожіші/найдешевші товари
- **Статус запасів**: наявність, на вичерпанні, дисконти

## 🐞 Troubleshooting

### Backend не запускається
```bash
# Перевірте що порт 4000 вільний
netstat -ano | findstr :4000

# Видаліть старі файли БД і перезапустіть
rm backend/shop.db
npm run dev:backend
```

### Frontend не видить Backend
```bash
# Переконайтесь що Backend запущений на 4000
# Перевірте VITE_API_BASE в .env.local
# Очистіть кеш браузера (Ctrl+Shift+Delete)
```

### Помилки з БД
```bash
# Переініціалізуйте БД
cd backend
rm shop.db
node db_init.js
cd ..
npm run dev:all
```

### JWT помилки
```bash
# Очистіть localStorage
# F12 > Application > LocalStorage > очистити
# Перезалогуйтесь
```

## 📚 Документація та Ресурси

- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [SQLite Docs](https://www.sqlite.org/docs.html)
- [JWT Intro](https://jwt.io/introduction)
- [REST API Best Practices](https://restfulapi.net)

## 🎓 Структура коду - Кращі практики

```javascript
// Організація компонентів
components/
├── Feature/
│   ├── Feature.jsx      (компонент)
│   ├── Feature.module.css (стилі)
│   └── index.js         (export)
```

```javascript
// API клієнт
api/
├── endpoints.js         (URLs)
├── requests.js          (functions)
└── handlers.js          (error handling)
```

```javascript
// Управління станом
auth/
├── AuthContext.jsx      (context)
├── useAuth.js          (hook)
└── actions.js          (functions)
```

## 💬 Контрибьютинг

Якщо хочете розвивати проект:

1. Fork репозиторію
2. Створіть feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit зміни (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Відкрийте Pull Request

## 👨‍💻 Розробник

**Автор:** Кушнір Владислава
**Версія:** 2.0.0  
**Статус:** ✅ Production Ready  
**Остання оновлена:** Листопад 2025

---

### Швидкі посилання
- 🏠 [Головна](http://localhost:5173)
- 🛍️ [Каталог](http://localhost:5173/products)
- 🛒 [Кошик](http://localhost:5173/cart)
- 👤 [Акаунт](http://localhost:5173/account)
- ⚙️ [Адмін панель](http://localhost:5173/admin)
- 📧 [Контакти](http://localhost:5173/contacts)

**Готово до продакшену!** 🚀
