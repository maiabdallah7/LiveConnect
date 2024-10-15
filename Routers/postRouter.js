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

/*router.post('/:id/sharePost', isAuth, postController.sharePost);
router.post('/:id/savePosts', isAuth, postController.savePosts);

//Comment
//router.get('/:postId/getPostComments' , isAuth, postController.getPostComments)

router.put('/:postId/:commentId/updateComment', isAuth, postController.updateComment);

router.post('/:postId/commentId/reactComment', isAuth, postController.reactComment);
//Reply
router.post('/:postId/:commentId/replyComment', isAuth,upload.array('files'), postController.replyComment);
router.post('/:postId/:commentId/:replyId/reactReply', isAuth, postController.reactReply);
router.delete('/:postId/:commentId/:replyId/deleteReply', isAuth, postController.deleteRely);
router.get('/:postId/comments/:commentId/replies' , isAuth , postController.getCommentReplies)*/

module.exports = router;
