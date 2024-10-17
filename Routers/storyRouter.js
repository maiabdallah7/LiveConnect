const express = require('express');
const storyController = require('../Controllers/storyController');
const isAuth = require('../Middleware/isAuth');
const upload= require('../Middleware/uploadFiles')
const router = express.Router();

//http://localhost:3000/api/story
router.get('/stories', isAuth, storyController.getAllStories);
router.post('/addStory',isAuth,  upload.array('files'), storyController.createStory);
router.delete('/:id',isAuth, storyController.DeleteStory);


module.exports = router;
