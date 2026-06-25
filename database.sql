CREATE DATABASE resenas_juegos;
USE resenas_juegos;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);

CREATE TABLE generos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE videojuegos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    genero VARCHAR(50) NOT NULL,
    calificacion DECIMAL(3,1) NOT NULL,
    fecha_lanzamiento DATE NOT NULL,
    resena TEXT NOT NULL,
    imagen_url VARCHAR(255) NOT NULL
);

INSERT INTO usuarios (username, password) VALUES ('admin', 'admin123');

INSERT INTO generos (nombre) VALUES 
('Accion'), 
('Aventura'), 
('RPG'), 
('Shooter'), 
('Estrategia'), 
('Terror');
