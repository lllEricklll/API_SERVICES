const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors'); 


const app = express();
const port = 3001;

const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'inventario_PUCE',
  password: 'admin123.prueba',
  port: 5431,
};

const pool = new Pool(dbConfig);
app.use(bodyParser.json());
app.use(cors());

app.get('/egreso_donaciones', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM egreso_donaciones');
    const datos = result.rows;
    res.json(datos);
  } catch (error) {
    console.error('Error al obtener datos: ', error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});
app.get('/donantes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM donante');
    const datos = result.rows;
    res.json(datos);
  } catch (error) {
    console.error('Error al obtener datos: ', error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});
app.get('/tipoDonacion', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tipo_donacion');
    const datos = result.rows;
    res.json(datos);
  } catch (error) {
    console.error('Error al obtener datos: ', error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuario');
    const datos = result.rows;
    res.json(datos);
  } catch (error) {
    console.error('Error al obtener datos: ', error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});


app.get('/donaciones', async (req, res) =>{

  try {
    const result = await pool.query('select * from donaciones');
    const datos = result.rows;
    res.json(datos);
  } catch (error){
    console.error('Error al traer los datos: ', error);
    res.status(500).json({ error: 'Error al obtener los datos'})
  }
});



app.get('/articulos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM egreso_donaciones WHERE id_donaciones = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }

    const datos = result.rows[0]; 
    res.json(datos);
  } catch (error) {
    console.error('Error al obtener datos: ', error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});
app.get('/articulos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM donaciones where unidades >=1');
    const datos = result.rows;
    res.json(datos);
  } catch (error) {
    console.error('Error al obtener datos: ', error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

  

app.post('/registroUsuario', async(req, res) => {
  const { nombre, apellido, username } = req.body;
  try {
    // Realiza la inserción en la base de datos
    const query = 'INSERT INTO usuario (nombre_usuario, apellido_usuario, username) VALUES ($1, $2, $3)';
    await pool.query(query, [nombre, apellido, username]);

    // Responde con una confirmación de inserción
    res.json({ message: 'Usuario insertado con éxito' });
  } catch (error) {
    console.error('Error al insertar usuario: ', error);
    res.status(500).json({ error: 'Error al insertar usuario' });
  }
});


app.post('/registroDonante', async(req, res) => {
  const { nombreDonante } = req.body;
  try {
    // Realiza la inserción en la base de datos
    const query = 'INSERT INTO donante (nombre_donante) VALUES ($1)';
    await pool.query(query, [nombreDonante]);

    // Responde con una confirmación de inserción
    res.json({ message: 'Donante insertado con éxito' });
  } catch (error) {
    console.error('Error al insertar usuario: ', error);
    res.status(500).json({ error: 'Error al insertar usuario' });
  }
});

app.post('/registroDonanteDonaciones', async(req, res) => {
  const {selectedDonante,selectedTipoDonacion,nombreArticulo,cantidades,detalle,
    fechaCaducidad,observacion,fechaRegistro }= req.body;
  try {
    // Realiza la inserción en la base de datos
    const query = 'INSERT INTO donaciones_donante (id_donante, id_tipo_donacion, nombre_articulo, cantidad, detalle_producto, fecha_caducidad, observacion, fecha_registro) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)';
    await pool.query(query, [selectedDonante,selectedTipoDonacion,nombreArticulo,
      cantidades,detalle,fechaCaducidad,observacion,fechaRegistro]);

    // Responde con una confirmación de inserción
    res.json({ message: 'Donante insertado con éxito' });
  } catch (error) {
    console.error('Error al insertar usuario: ', error);
    res.status(500).json({ error: 'Error al insertar usuario' });
  }
});

app.post('/registroEgresosDonaciones', async(req, res) => {
  const {
    selectedUsuario,
    date_registro,
    selectedTipoDonacion,
    unidades,
    peso,
    medida,
    observacion,
    selectedArticulo,
    nombreArticulo }= req.body;
  try {
    // Paso 1: Obtener las unidades actuales de la donación
    const query = 'SELECT id_donaciones, unidades FROM donaciones WHERE id_donaciones = $1 AND unidades >= $2';
    const resultSelectDonacion = await pool.query(query, [selectedArticulo, unidades]);
    if (resultSelectDonacion.rows.length === 0) {
      return res.status(400).json({ error: 'No hay suficientes unidades disponibles para la donación actual.' });
    }
    // Paso 2: Restar las unidades
    const unidadesRestantes = resultSelectDonacion.rows[0].unidades - unidades;
    
    // Paso 3: Actualizar la tabla donaciones con las nuevas unidades restantes
    const query1 = 'UPDATE donaciones SET unidades = $1 WHERE id_donaciones = $2';
    await pool.query(query1,[unidadesRestantes, selectedArticulo]);

    // Paso 4: Realizar la inserción en la tabla de egresos
    const queryInsertEgreso = 'INSERT INTO egreso_donaciones (id_usuario, fecha_actual, nombre_articulo, unidades, peso, medida, observacion) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    await pool.query(queryInsertEgreso,[selectedUsuario, date_registro, nombreArticulo, unidades, peso, medida, observacion]);

    // Responde con una confirmación de inserción
    res.json({ message: 'Egreso insertado con éxito' });
  } catch (error) {
    console.error('Error al insertar usuario: ', error);
    res.status(500).json({ error: 'Error al insertar usuario' });
  }
});








app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
