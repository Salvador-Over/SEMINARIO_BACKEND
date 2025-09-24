const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // 🔹 Para cifrar contraseñas

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



////// NUEVO VEHICULO
// Ruta para registrar un nuevo vehículo (entrada)
app.post('/vehiculos', (req, res) => {
  const { placa, marca, color, tipo } = req.body;

  if (!placa || !tipo) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  const query = `
    INSERT INTO vehiculos (placa, marca, color, tipo)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(query, [placa, marca, color, tipo], (err, results) => {
    if (err) {
      console.error('Error al registrar vehículo:', err);
      return res.status(500).json({ mensaje: 'Error al registrar vehículo' });
    }
    res.json({ mensaje: 'Vehículo registrado correctamente', id: results.insertId });
  });
});

// Ruta para obtener vehículos activos (los que están en el parqueo)
app.get('/vehiculos/activos', (req, res) => {
  const query = `
    SELECT id, placa, marca, color, tipo, hora_ingreso
    FROM vehiculos
    WHERE estado = 'Activo'
    ORDER BY hora_ingreso DESC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener vehículos activos:', err);
      return res.status(500).json({ mensaje: 'Error al obtener vehículos activos' });
    }
    res.json(results);
  });
});


// ================================
// RUTAS PARA USUARIOS
// ================================

// Crear usuario
app.post('/api/usuarios', (req, res) => {
  const { usuario, contrasena, rol } = req.body;

  if (!usuario || !contrasena || !rol) {
    return res.status(400).json({ mensaje: "Faltan datos" });
  }

  // Cifrar contraseña antes de guardar
  const hashedPassword = bcrypt.hashSync(contrasena, 10);

  const query = "INSERT INTO usuarios (usuario, contrasena, rol) VALUES (?, ?, ?)";
  connection.query(query, [usuario, hashedPassword, rol], (err, results) => {
    if (err) {
      console.error("❌ Error al registrar usuario:", err);
      return res.status(500).json({ mensaje: "Error al registrar usuario" });
    }
    res.json({ mensaje: "✅ Usuario registrado correctamente", id: results.insertId });
  });
});

// Obtener usuarios
app.get('/api/usuarios', (req, res) => {
  const query = "SELECT id, usuario, rol FROM usuarios ORDER BY id DESC";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener usuarios:", err);
      return res.status(500).json({ mensaje: "Error al obtener usuarios" });
    }
    res.json(results);
  });
});
