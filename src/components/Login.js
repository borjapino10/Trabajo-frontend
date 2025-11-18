import React, { useState } from "react";

/**
 * Login component
 * - Envía { correo, password } al endpoint /api/usuarios/login
 * - Guarda token en localStorage si recibe token
 * - Llama onLoginSuccess() si el login fue OK
 *
 * Asegúrate que tu backend devuelve { token: '...' } o ajusta la extracción.
 */
export default function Login({ onLoginSuccess }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const API = "http://localhost:3000/api/usuarios/login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("http://localhost:3000/api/usuarios/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", 
  body: JSON.stringify({ correo, password })
});

      const data = await res.json();

      if (!res.ok) {
        // backend puede devolver { error: "..." } o { msg: "..." }
        setMsg(data.error || data.msg || "Credenciales incorrectas");
        setLoading(false);
        return;
      }

      // Normalmente el backend devuelve token en data.token
      const token = data.token || data.tokenJwt || data.jwt;
      if (!token) {
        setMsg("No se recibió token del servidor");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      // si devuelve usuario, lo guardamos también (opcional)
      if (data.usuario || data.user) {
        localStorage.setItem("usuario", JSON.stringify(data.usuario || data.user));
      }

      setMsg("Inicio de sesión correcto");
      onLoginSuccess && onLoginSuccess();
    } catch (err) {
      console.error("Login error:", err);
      setMsg("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Correo</label><br />
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div style={{ marginTop: 8 }}>
          <label>Contraseña</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </div>

        {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
      </form>
    </div>
  );
  
}

