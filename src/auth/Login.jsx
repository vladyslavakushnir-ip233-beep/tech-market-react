import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { GoogleLogin } from '@react-oauth/google'

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const responseMessage = async (response) => {
    try {
      setErr(null);
      setLoading(true);
      const credential = response?.credential;
      if (!credential) throw new Error('Не вдалося отримати Google credential');
      await loginWithGoogle(credential);
      navigate("/");
    } catch (error) {
      setErr(error.message || 'Помилка Google входу');
    } finally {
      setLoading(false);
    }
  };

  const errorMessage = (error) => {
    console.error(error);
    setErr('Помилка Google входу');
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4" style={{ maxWidth: 720 }}>
      <Card className="p-4 shadow-sm">
        <h2 className="mb-3">Увійти</h2>
        {err && <Alert variant="danger">{err}</Alert>}
        <Form onSubmit={submit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <div>
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
            <br />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Вхід..." : "Увійти"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
