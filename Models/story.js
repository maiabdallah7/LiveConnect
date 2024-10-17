const mongoose = require('mongoose');
const attachmentSchema = new mongoose.Schema({
    type: {
    type: String,
    enum: ['image', 'video'],
    required: true,
    },
    url: {
    type: String,
    required: true,
    },
});

const storySchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, 
        expires: 86400, // Automatically delete after 24 hours (86400 seconds = 24 hours)
    },
    attachments: [attachmentSchema],
});

const Story = mongoose.model('Story', storySchema);
module.exports = Story;