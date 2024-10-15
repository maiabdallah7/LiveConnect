const express = require('express');

const postController = require('../Controllers/postController');
const isAuth = require('../Middleware/isAuth');
const upload= require('../Middleware/uploadFiles')
const router = express.Router();

//http://localhost:3000/api/post
router.post('/addPost',isAuth,  upload.array('files'), postController.AddPost);
router.delete('/:id',isAuth, postController.DeletePost);
router.get('/posts', isAuth, postController.getAllPosts);

module.exports = router;