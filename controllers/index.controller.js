const  { Pool } = require('pg');

const pool = new Pool ({
    host: 'localhost',
    user: 'postgres',
    password: 'admin',
    database: 'INVENTARIO',
    port: '5432'
});

const getUsers = async (req, res) => {
    const response = await pool.query('SELECT * FROM donante');
    console.log(response.rows);
    res.send('users');
}
module.exports ={
    getUsers
}