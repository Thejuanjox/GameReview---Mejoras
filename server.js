const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = 3000;

const authController = require('./controllers/authController');
const juegosController = require('./controllers/juegosController');
const generosController = require('./controllers/generosController');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public', 'uploads'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secreto123',
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/admin', (req, res) => {
    if (req.session.logueado) {
        res.sendFile(path.join(__dirname, 'views', 'admin.html'));
    } else {
        res.redirect('/login');
    }
});

app.post('/api/login', authController.login);
app.post('/api/logout', authController.logout);

app.get('/api/juegos', juegosController.listar);
app.post('/api/juegos', upload.single('imagen'), juegosController.agregar);
app.put('/api/juegos/:id', upload.single('imagen'), juegosController.editar);
app.delete('/api/juegos/:id', juegosController.eliminar);

app.get('/api/generos', generosController.listar);
app.post('/api/generos', generosController.agregar);
app.put('/api/generos/:id', generosController.editar);
app.delete('/api/generos/:id', generosController.eliminar);

app.listen(PORT, () => {
    console.log('Servidor en puerto 3000');
});