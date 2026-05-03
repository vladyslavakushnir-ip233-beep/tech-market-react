import React, { useState, useEffect } from "react";
import { HashRouter, Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import "./App.css";
import "./styles/global.css";

import Home from "./pages/Home";
import Contacts from "./pages/Contacts";
import About from "./pages/About";
import ProductList from "./components/ProductList";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import Checkout from "./components/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AdminPanel from "./components/AdminPanel";
import ProfilePage from "./pages/ProfilePage";
import Footer from "./components/Footer";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";
import { fetchProducts } from "./api/api";

function TopNav({ cartCount }) {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">TechMarket</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Головна</Nav.Link>
            <Nav.Link as={Link} to="/products">Каталог</Nav.Link>
            <Nav.Link as={Link} to="/about">Про нас</Nav.Link>
            <Nav.Link as={Link} to="/contacts">Контакти</Nav.Link>
          </Nav>

          <Nav>
            <Nav.Link as={Link} to="/cart">
              Кошик ({cartCount})
            </Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/profile">Профіль (<strong>{user.name}</strong>)</Nav.Link>
                {user.role === "admin" && (
                  <Nav.Link as={Link} to="/admin">Адмін</Nav.Link>
                )}
                <Button variant="outline-secondary" size="sm" onClick={logout}>
                  Вихід
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Увійти</Nav.Link>
                <Nav.Link as={Link} to="/register">Реєстрація</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartInitialized, setCartInitialized] = useState(false);

  // Initialize cart from localStorage only once when user changes
  useEffect(() => {
    const userId = user?.id || 'guest';
    const saved = localStorage.getItem(`cart_${userId}`);
    console.log(`[Cart Init] userId: ${userId}, saved cart:`, saved ? JSON.parse(saved) : 'none');
    
    if (saved) {
      try {
        const parsedCart = JSON.parse(saved);
        setCart(parsedCart);
      } catch (e) {
        console.error('Failed to parse cart:', e);
        setCart([]);
      }
    } else {
      if (userId !== 'guest') {
        const guestCart = localStorage.getItem('cart_guest');
        console.log('[Cart Init] Checking guest cart:', guestCart ? JSON.parse(guestCart) : 'none');
        if (guestCart) {
          try {
            const parsedGuestCart = JSON.parse(guestCart);
            setCart(parsedGuestCart);
            localStorage.removeItem('cart_guest');
            console.log('[Cart Init] Migrated guest cart to user cart');
            return;
          } catch (e) {
            console.error('Failed to parse guest cart:', e);
          }
        }
      }
      setCart([]);
    }
    setCartInitialized(true);
  }, [user?.id]);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(err => console.error("Failed to fetch products:", err))
      .finally(() => setLoading(false));
  }, []);

  // Save cart to localStorage whenever it changes, but only after initialization
  useEffect(() => {
    if (cartInitialized) {
      const userId = user?.id || 'guest';
      console.log(`[Cart Save] Saving cart for ${userId}:`, cart);
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    }
  }, [cart, cartInitialized]);

  const addToCart = (product) => {
    console.log('[AddToCart] Adding product:', product);
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const updated = prev.map(item =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
        console.log('[AddToCart] Updated existing item:', updated);
        return updated;
      }
      const newCart = [...prev, { ...product, qty: 1 }];
      console.log('[AddToCart] Added new item:', newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    console.log('[RemoveFromCart] Removing product:', productId);
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQty = (productId, qty) => {
    console.log('[UpdateCartQty] Updating qty for product', productId, 'to', qty);
    if (qty <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, qty } : item
        )
      );
    }
  };

  return (
    <>
      <TopNav cartCount={cart.length} />
      <div style={{ minHeight: "calc(100vh - 200px)" }}>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/products"
          element={
            <ProductList
              products={products}
              loading={loading}
              onAddToCart={addToCart}
            />
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProductPage
              products={products}
              onAddToCart={addToCart}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              setCart={setCart}
              onUpdateQty={updateCartQty}
              onRemove={removeFromCart}
            />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout
                cart={cart}
                setCart={setCart}
              />
            </ProtectedRoute>
          }
        />

        <Route path="/order-success" element={<OrderSuccess />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
}
