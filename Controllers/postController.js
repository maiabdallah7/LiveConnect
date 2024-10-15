const Post = require('../Models/post').Post;
const User = require('../Models/user');
const Comment = require('../Models/post').Comment;
const Reply = require('../Models/post').Reply;
const Share = require('../Models/post').Share;
const cloudinary = require("../Services/cloudinary");
const uploadFiles = require('../Middleware/uploadFiles')

//Get All posts
const getAllPosts = async(req,res) => {
    try{
        const posts = await Post.find(); // Fetch all posts
        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        }
        res.status(200).json(posts); // Return all posts
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

//Add post
const AddPost = async(req,res) => {
    try {
        const author = await User.findById(req.userId);

        const { content } = req.body;
        const files = req.files;
        let attachments = [];
        if (files && files.length > 0) {
            const uploadPromises = files.map(file => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "PostLiveConnect",
                });
            });
            const uploadResults = await Promise.all(uploadPromises);
            attachments = uploadResults.map(result => ({
                type: result.resource_type === 'image' ? 'image' : result.resource_type === 'video' ? 'video' : 'file',
                url: result.secure_url,
                public_id: result.public_id
            }));
        }
        const newPost = new Post({
            author: author,
            content: content,
            attachments: attachments,
            date: new Date()  
        });
        await newPost.save();
        res.status(200).json({ message: 'Your post was shared.' });
    } catch (err) {
        console.error('Error creating post:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const DeletePost = async(req,res) => {
    try{
        //find the id of the post to be deleted
        const post = await Post.findById(req.params.id);
        await post.deleteOne();
        res.status(200).json({message:'The post has been successfully deleted.'})
    }
    catch(err){
    console.error('Error deleting post.', err);
    if (!err.statusCode) {
    err.statusCode = 500;
    }
    next(err);  
    }
}

module.exports = {
    getAllPosts,
    AddPost,
    DeletePost,
}