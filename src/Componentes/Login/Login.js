import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import 'boxicons/css/boxicons.min.css';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [recordarme, setRecordarme] = useState(false);
  const [rol, setRol] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación rápida antes de enviar
    if (!usuario || !contrasena || !rol) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena, rol, recordarme })
      });

      const data = await res.json();

      console.log("Respuesta backend:", data);
      alert(data.mensaje);

      if (data.exito) {
        // Instrucción para Guardar token y rol desde el backend
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.usuario.rol);
        localStorage.setItem("usuario", data.usuario.usuario); // Instrucción para guardar el nombre del usuario
        // Instrucción para Redirigir al menú
        navigate("/menu", { state: { rol: data.usuario.rol } });
      }
    } catch (err) {
      console.error("Error al enviar datos:", err);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>

        <div className="input-box">
          <input
            type="text"
            placeholder="Nombre de usuario"
            required
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <i className="bx bxs-user"></i>
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Contraseña"
            required
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
          <i className="bx bxs-lock-alt"></i>
        </div>

        <div className="input-box">
          <select
            required
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="input"
          >
            <option value="">Selecciona un rol</option>
            <option value="admin">Administrador</option>
            <option value="usuario">Usuario</option>
            <option value="supervisor">Supervisor</option>
          </select>
          <i className="bx bxs-user-badge"></i>
        </div>

        <div className="remember-forgot">
          <label>
            <input
              type="checkbox"
              checked={recordarme}
              onChange={() => setRecordarme(!recordarme)}
            />
            Recuérdame
          </label>
          <a href="#">¿Olvidaste tu contraseña?</a>
        </div>

        <button type="submit" className="btn">Iniciar sesión</button>

        <div className="register-link">
          <p>
            Hola...!!! 😎😂
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
