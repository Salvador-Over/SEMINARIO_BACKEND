import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Menu/Menu.css";
import { 
  FaReceipt, FaCalculator, FaCar, FaChartPie, FaFileInvoiceDollar, 
  FaUsers, FaCog, FaSignOutAlt, FaUserTie, FaClock
} from "react-icons/fa";

const Menu = () => {
  const navigate = useNavigate();

  // 🔹 Instrucción para Validar token al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Esta instrucción redirige al login si no hay token
    }
  }, [navigate]);

  //const rol = localStorage.getItem("rol") || "Usuario";
  const usuario = localStorage.getItem("usuario") || "Usuario";
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Esta instrucción borra el token al cerrar sesión
    localStorage.removeItem("rol");
    navigate("/");
  };

  const getRolNombre = (rol) => {
    switch(rol) {
      case 'admin': return 'Administrador';
      case 'usuario': return 'Usuario';
      case 'supervisor': return 'Supervisor';
      default: return 'Usuario';
    }
  };

  const items = [
    { icon: <FaUsers />, label: "Gestion De Usuarios Del Sistema", color: "#66d4ff" },
    { icon: <FaCar />, label: "Registro De Entradas y Salidas De Vehículos", color: "#66d4ff" },
    { icon: <FaCalculator />, label: "Cálculo Automático De Tarifas", color: "#66d4ff" },
    { icon: <FaReceipt />, label: "Generación De Tickets", color: "#66d4ff" },
    { icon: <FaFileInvoiceDollar />, label: "Cobros Y Facturación", color: "#66d4ff" },
    { icon: <FaChartPie />, label: "Reportes Automáticos", color: "#66d4ff" },
    { icon: <FaCog />, label: "Ajustes", color: "#66d4ff" },
  ];

  return (
    <div>
      {/* Mensaje de Bienvenida */}
      <div className="welcome-floating">
        <FaUserTie className="welcome-icon" size={16}/>
        Bienvenido | {usuario}
      </div>

      {/* Mostrar Fecha y Hora */}
      <div className="datetime-floating">
        <div className="mini-clock">
          <div className="hand hour" style={{ transform: `rotate(${dateTime.getHours() * 30 + dateTime.getMinutes()/2}deg)` }} />
          <div className="hand minute" style={{ transform: `rotate(${dateTime.getMinutes() * 6}deg)` }} />
          <div className="hand second" style={{ transform: `rotate(${dateTime.getSeconds() * 6}deg)` }} />
        </div>
        {dateTime.toLocaleTimeString().toUpperCase()}
      </div>

      {/* Contenedor del menú */}
      <div className="menu-container">
        <div className="menu-header">
          <h1 className="menu-title">Gestión de Estacionamiento.</h1>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Salir</span>
          </button>
        </div>
        <div className="menu-grid">
          {items.map((item, index) => (
            <div key={index} className="menu-card" style={{ backgroundColor: item.color }}>
              <div className="menu-icon">{item.icon}</div>
              <p className="menu-label">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
