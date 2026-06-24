const db = require('../config/db');

const listar = (req, res) => {
    db.query('SELECT * FROM generos', (err, filas) => {
        if (err) return res.status(500).json({ error: 'Error DB' });
        res.json(filas);
    });
};

const agregar = (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'Faltan datos' });
    db.query('INSERT INTO generos (nombre) VALUES (?)', [nombre], (err, resultado) => {
        if (err) return res.status(500).json({ error: 'Error DB' });
        res.status(201).json({ id: resultado.insertId, nombre });
    });
};

const editar = (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    db.query('UPDATE generos SET nombre = ? WHERE id = ?', [nombre, id], (err) => {
        if (err) return res.status(500).json({ error: 'Error DB' });
        res.json({ mensaje: 'Genero actualizado' });
    });
};

const eliminar = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM generos WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Error DB' });
        res.json({ mensaje: 'Genero eliminado' });
    });
};

module.exports = { listar, agregar, editar, eliminar };