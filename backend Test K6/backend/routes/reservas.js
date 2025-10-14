const express = require('express');
const Reserva = require('../models/Reserva');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protege todas las rutas siguientes con autenticación
router.use(authMiddleware);

// Listar todas las reservas del usuario autenticado
router.get('/', async (req, res) => {
  const reservas = await Reserva.find({ usuario: req.userId });
  res.json(reservas);
});

// Crear nueva reserva
router.post('/', async (req, res) => {
  const { fecha, sala, hora } = req.body;

  const nueva = new Reserva({
    usuario: req.userId,
    fecha,
    sala,
    hora
  });

  await nueva.save();
  res.status(201).json(nueva);
});

// Eliminar una reserva (solo si pertenece al usuario)
router.delete('/:id', async (req, res) => {
  await Reserva.deleteOne({ _id: req.params.id, usuario: req.userId });
  res.json({ msg: 'Reserva cancelada' });
});

module.exports = router;