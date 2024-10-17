const express = require('express');

const postController = require('../Controllers/postController');
const isAuth = require('../Middleware/isAuth');
const upload= require('../Middleware/uploadFiles')
const router = express.Router();

//http://localhost:3000/api/post
router.post('/addPost',isAuth,  upload.array('files'), postController.AddPost);
router.delete('/:id',isAuth, postController.DeletePost);
router.get('/posts', isAuth, postController.getAllPosts);

router.post('/:id/addComment', isAuth,upload.array('files'), postController.AddComment);
router.delete('/:postId/:commentId/deleteComment', isAuth, postController.DeleteComment);
router.get('/comments', isAuth, postController.getAllComments);

router.post('/:id/reactPost', isAuth, postController.ReactPost);


module.exports = router;
