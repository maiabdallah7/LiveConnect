const User = require('../Models/user')
const authService = require('../Services/authServices')
const hashing = require('../Middleware/hashing')

// User Registration
const register = async (req, res) => {
    //console.log(req.body);  // Log request body
    try {
        const { firstName, lastName, email, password, dateOfBirth } = req.body;
        const hashedPassword = await hashing.hashPassword(password);
        const newUser = new User({ firstName, lastName, email, password: hashedPassword, dateOfBirth });
        
        await newUser.save();
        const token = await authService.generateToken({ userId: newUser._id });
        const refreshToken = await authService.generateRefreshToken({ userId: newUser._id });
        res.status(201).json({ token, refreshToken });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// User Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await authService.comparePassword(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = await authService.generateToken({ userId: user._id });
        const refreshToken = await authService.generateRefreshToken({ userId: user._id });
        res.status(200).json({ token, refreshToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users
const getAllUsers = async(req,res) =>{
    try{
        const users = await User.find(); // Fetch all users
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json(users); // Return all users
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User Logout
const logout = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const { refreshToken } = req.body; 
        user.refreshToken = null;
        await user.save();

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Export your functions
module.exports = {
    register,
    login,
    getAllUsers,
    logout,
};