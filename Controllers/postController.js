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
};

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
};

//Delete post
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
};

//Add comment
const AddComment = async(req,res,next) =>{
    try{    
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'This post does not exist' });
        }
        const author = await User.findById(req.userId);
        const  {content} = req.body;
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
        const newComment = new  Comment ({
            author: author,
            content:content,
            attachments: attachments,
        });
        post.comments.push(newComment);
        await post.save(); 
        await newComment.save();
        res.status(200).json({ message: 'Your comment was shared.' });

    } catch (err) {
    console.error("Error comment in the  post.", err);
    if (!err.statusCode) {
    err.statusCode = 500;
    }
    next(err);
    }
};

//Delete comment
const DeleteComment = async(req,res,next) => {
    try{
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        
        post.comments.pull(comment);
        await comment.deleteOne();
        await post.save();
        res.status(200).json({message:'Your comment has been successfully deleted.'})
    }
    catch(err){
    console.error('Error deleting post.', err);
    if (!err.statusCode) {
    err.statusCode = 500;
    }
    next(err);  
    }
};

//Get all comments
const getAllComments = async(req,res,next) =>{
    try{
        const comments = await Comment.find(); // Fetch all comments
        if (comments.length === 0) {
            return res.status(404).json({ message: 'No comments found' });
        }
        res.status(200).json(comments); // Return all comments
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

// React post
const ReactPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'This post does not exist' });
        }
        const author = await User.findById(req.userId);
        // Check if the user has already reacted to the post
        let userReacted = post.reacts.users.includes(author._id);
        if (!userReacted) {
            // User has not reacted, allow reacting to the post
            post.reacts.count += 1;
            post.reacts.users.push(author._id);
            await post.save();
            return res.status(200).json({ message: 'You liked the post.' });
        } else {
            // User has already reacted, allow disliking the post
            post.reacts.count -= 1;
            post.reacts.users.pull(author._id);
            await post.save();
            return res.status(200).json({ message: 'You disliked the post.' });
        }
    } catch (err) {
        console.error("Error reacting post.", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


module.exports = {
    getAllPosts,
    AddPost,
    DeletePost,
    AddComment,
    DeleteComment,
    getAllComments,
    ReactPost,
}