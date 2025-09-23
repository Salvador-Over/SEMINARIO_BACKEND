const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "tu_clave_secreta"; // puedes dejarla aquí fijo si no usas .env

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Configuración de conexión a Azure MySQL
const connection = mysql.createConnection({
  host: "seminario.mysql.database.azure.com", // ejemplo: mydbserver.mysql.database.azure.com
  user: "administradorseminario",              // ejemplo: adminuser@mydbserver
  password: "Seminario123",
  database: "seminario",
  port: 3306,
  ssl: {
    rejectUnauthorized: true // Azure requiere SSL para conexiones seguras
  }
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Error de conexión a Azure:", err);
    return;
  }
  console.log("✅ Conexión exitosa a Azure MySQL");
});

// Ruta para el login
app.post('/api/login', (req, res) => {
  const { usuario, contrasena, rol } = req.body;

  if (!usuario || !contrasena || !rol) {
    return res.status(400).json({ mensaje: 'Faltan datos' });
  }

  const query = `
    SELECT * FROM usuarios
    WHERE BINARY usuario = ? AND contrasena = ? AND rol = ?
    LIMIT 1
  `;

  connection.query(query, [usuario, contrasena, rol], (err, results) => {
    if (err) {
      console.error("❌ Error en la consulta:", err);
      return res.status(500).json({ mensaje: 'Error del servidor' });
    }

    if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign(
        { id: user.id, usuario: user.usuario, rol: user.rol },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.json({ 
        mensaje: "Inicio de sesión exitoso",
        exito: true,
        usuario: user,
        token
      });
    } else {
      res.status(401).json({ mensaje: "Credenciales incorrectas", exito: false });
    }
  });
});

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
