import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.user) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            logout();
          }
        })
        .catch(() => logout());
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) throw new Error(data.error || "Помилка входу");

    setToken(data.token);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  };

  const loginWithGoogle = async (credential) => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) throw new Error(data.error || "Помилка входу через Google");

    setToken(data.token);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  };

  const register = async (payload) => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) throw new Error(data.error || "Помилка реєстрації");
    
    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
