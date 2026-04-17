
//aqui se define la bd

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(express.json());

//ngrok
app.use((req, res, next) => {
    res.setHeader('ngrok-skip-browser-warning', 'true');
    next();
});

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 4000,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a TiDB:', err.message);
        return;
    }
    console.log('¡Conectado exitosamente a la base de datos en la nube!');
});




/*
// conexión a MariaDB
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "wereables"
});




// verificar conexión
db.connect(err => {
    if (err) {
        console.log("Error conexión BD:", err);
    } else {
        console.log("Conectado a MariaDB");
    }
});
*/
// INSERTAR datos
app.post("/health", (req, res) => {
    const { steps, heartRate, distance, active_calories, total_calories } = req.body;

    const query = "INSERT INTO health_data (steps, heart_rate, distance, active_calories, total_calories) VALUES (?, ?, ?, ?, ?)";

    db.query(query, [steps, heartRate, distance, active_calories, total_calories], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        res.json({ message: "Datos guardados" });
    });
});



// OBTENER datos
app.get("/health", (req, res) => {
    db.query("SELECT * FROM health_data ORDER BY id DESC", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.get("/", (req, res) => {
    res.send("✅ Servidor Node funcionando y conectado al túnel!");
});



app.listen(3000, "0.0.0.0", () => {
    console.log("API corriendo en http://localhost:3000");
});
