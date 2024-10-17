const User = require('../Models/user')
const userService = require('../Services/userService')
//Get all Users
const UpdateUser = async(req,res,next) =>{
    try{
        //take data 
    const userId = req.userId;

    let { firstName, lastName, bio, country } = req.body;
    const file = req.file;
    console.log(req.body, file)

    //update user
    const user = await userService.findUser('_id', userId);
    //check if user exist
    if (!user) {
    throw new Error('User not found');
    }
    //update user data
    if (file) {
    user.profilePicture = file.path;
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.bio = bio;
    user.country = country;

    //save user
    await user.save()
    //send response
    res.status(200).json({
        success: true,
        data: {
        user: user
        }
    });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

// Follow User
const followUser = async (req, res, next) => {
    try {
        // Extract data from request
        const userId = req.userId;  // The current user (the one making the request)
        const { followId } = req.params;  // The user to be followed/unfollowed

        // Find both users
        const user = await userService.findUser('_id', userId);
        const follow = await userService.findUser('_id', followId);

        // Check if the user to follow exists
        if (!follow) {
            return res.status(404).json({
                success: false,
                message: 'This user does not exist',
            });
        }

        // Message to return after the operation
        let message;

        // Check if the user is already following the other user
        if (!user.following.userIds.includes(followId)) {
            // Follow user (add followId to following list)
            user.following.counter++;
            user.following.userIds.push(followId);

            // Add current userId to the followed user's followers list
            follow.followers.counter++;
            follow.followers.userIds.push(userId);

            message = `You are now following ${follow.firstName}.`;
        } else {
            // Unfollow user (remove followId from following list)
            user.following.counter--;
            user.following.userIds.pull(followId);

            // Remove current userId from the followed user's followers list
            follow.followers.counter--;
            follow.followers.userIds.pull(userId);

            message = `You have unfollowed ${follow.firstName}.`;
        }

        // Save both users at the same time to ensure consistency
        await Promise.all([user.save(), follow.save()]);

        // Send response back to the client
        return res.status(200).json({
            success: true,
            message: message,
        });
    } catch (err) {
        console.error('Error in follow/unfollow operation:', err);
        return next(err);  // Pass the error to the error-handling middleware
    }
};


module.exports = {
    UpdateUser,
    followUser,
}