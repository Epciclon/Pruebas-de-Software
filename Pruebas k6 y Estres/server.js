const express = require('express');
const app = express();

const PORT = 4000;

app.use(express.json());

//Ruta get para simular una respuesta simple
app.get('/api', (req, res) => {
    setTimeout(() => {
        res.json({ message: 'Hello, World!' });
    }, Math.random() * 500);
});

//Ruta Post para recibir datos y responder con lo recibido
app.post('/api/data', (req, res) => {
    const data = req.body;
    setTimeout(() => {
        res.status(200).json({ received: data });
    }, Math.random() * 500);
});

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});