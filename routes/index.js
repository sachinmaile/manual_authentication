const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('router loaded');

router.get('/', homeController.home);
router.use('/users', require('./user'));
router.use('/posts',require('./post'));
router.use('/comments',require('./comments'));
router.use('/likes',require('./likes'));

module.exports = router;