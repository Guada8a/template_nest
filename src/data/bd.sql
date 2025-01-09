-- Crear la base de datos (opcional si ya está configurada en MYSQL_DATABASE)
CREATE DATABASE IF NOT EXISTS nest_db;

-- Seleccionar la base de datos
USE nest_db;

-- Crear tabla de ejemplo
CREATE TABLE IF NOT EXISTS usuarios (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  correo VARCHAR(255) NOT NULL,
  activo TINYINT(1) DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE INDEX correo_UNIQUE (correo ASC)
);

-- Insertar datos de ejemplo
INSERT INTO usuarios (nombre, correo) VALUES ('Juan Perez', 'juan@example.com');
