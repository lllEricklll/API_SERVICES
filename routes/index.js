const { Router} = require('express');
const router = Router();

const { getUsers} = require('../controllers/index.controller');

router.get('/user', getUsers);

module.exports = router