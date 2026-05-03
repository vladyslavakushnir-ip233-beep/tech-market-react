import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await register({ ...form, role: "user" });
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
        <h2 className="mb-3">Реєстрація</h2>
        {err && <Alert variant="danger">{err}</Alert>}
        <Form onSubmit={submit}>
          <Form.Group className="mb-3">
            <Form.Label>Ім'я</Form.Label>
            <Form.Control value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Пароль</Form.Label>
            <Form.Control type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
          </Form.Group>

          <Button type="submit" disabled={loading}>
            {loading ? "Реєстрація..." : "Зареєструватись"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
