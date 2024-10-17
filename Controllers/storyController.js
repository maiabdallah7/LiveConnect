const Story = require('../Models/story')
const cloudinary = require("../Services/cloudinary");
const uploadFiles = require('../Middleware/uploadFiles')

//Get All stories
const getAllStories = async(req,res,next) => {
    try{
        const stories = await Story.find(); // Fetch all stories
        if (stories.length === 0) {
            return res.status(404).json({ message: 'No stories found' });
        }
        res.status(200).json(stories); // Return all stories
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

// Post a Story
const createStory = async (req, res) => {
    try {
        const userId = req.userId;  // The user posting the story
        const {caption} = req.body;
        const files = req.files;
        let attachments = [];
        if (files && files.length > 0) {
            const uploadPromises = files.map(file => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "StoryLiveConnect",
                });
            });
            const uploadResults = await Promise.all(uploadPromises);
            attachments = uploadResults.map(result => ({
                type: result.resource_type === 'image' ? 'image' :  'video' ,
                url: result.secure_url,
                public_id: result.public_id
            }));
        }
        // Create a new story
        const story = new Story({
            author: userId,
            caption: caption ,  // Optional caption
            attachments: attachments,
            //date: new Date() 
        });

        await story.save();

        res.status(201).json({
            success: true,
            message: 'Story created successfully!',
            data: story,
        });
    } catch (error) {
        console.error('Error creating story:', error);
        res.status(500).json({
            success: false,
            message: 'Could not create story',
        });
    }
};

//Delete story
const DeleteStory = async(req,res,next) => {
    try{
        //find the id of the post to be deleted
        const story = await Story.findById(req.params.id);
        if(!story){
            return res.status(404).json({ message: 'Can\'t find the story' });
        }
        await story.deleteOne();
        res.status(200).json({message:'The story has been successfully deleted.'})
    }
    catch(err){
    console.error('Error deleting story.', err);
    if (!err.statusCode) {
    err.statusCode = 500;
    }
    next(err);  
    }
};


module.exports = {
    getAllStories,
    createStory,
    DeleteStory,
}