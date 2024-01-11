CREATE TABLE donante (
    id_donante serial PRIMARY KEY,
    fecha_actual_donante DATE,
    nombre_donante VARCHAR(100)
);

INSERT INTO donante (fecha_actual_donante, nombre_donante) VALUES 
('2021-05-10', 'Juan Perez'),
('2021-05-11', 'Maria Lopez'),
('2021-05-12', 'Carlos Gonzalez'),
('2021-05-13', 'Sofia Hernandez'),
('2021-05-14', 'David Martinez');

CREATE TABLE tipo_donacion (
    id_tipo serial PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL
);

CREATE TABLE donaciones_donante 
(
    id_donaciones_donante serial PRIMARY KEY,
    id_donante INT REFERENCES donante(id_donante),
    id_tipo_donacion INT REFERENCES tipo_donacion(id_tipo),
    nombre_articulo VARCHAR(100),
    cantidad INT,
    detalle_producto TEXT,
    fecha_caducidad DATE,
    observacion TEXT
);

CREATE TABLE usuario (
    id_usuario serial PRIMARY KEY,
    nombre_usuario VARCHAR(50),
    apellido_usuario VARCHAR(50),
    username VARCHAR(50) UNIQUE
);
CREATE TABLE semaforo (
    id_semaforo serial PRIMARY KEY,
    nombre_semaforo VARCHAR(50)
);
CREATE TABLE donaciones (
    id_donaciones serial PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario),
    id_tipo_donacion INT REFERENCES tipo_donacion(id_tipo),
    id_semaforo INT REFERENCES semaforo(id_semaforo),
    fecha_vencimiento DATE,
    nombre_articulo VARCHAR(100),
    unidades INT,
    peso NUMERIC(10, 2),
    medida VARCHAR(20)
);
CREATE TABLE egreso_donaciones (
    id_egreso serial PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario),
    id_donaciones INT REFERENCES donaciones(id_donaciones),
    fecha_actual DATE,
    unidades INT,
    peso NUMERIC(10, 2),
    medida VARCHAR(20),
    destino VARCHAR(100),
    observacion TEXT
);
