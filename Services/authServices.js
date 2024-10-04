const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userService = require('./userService');

class authService {
    static async comparePassword(inputPassword, userPassword) {
        return bcrypt.compare(inputPassword, userPassword);
    }

    static async generateToken(tokenData) {
        return jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });
    }

    static async generateRefreshToken(refreshTokenData) {
        const rtoken = jwt.sign(refreshTokenData, process.env.REFRESH_SECRET_KEY, { expiresIn: '1y' });
        await userService.findByIdAndUpdate(refreshTokenData.userId, 'refreshToken', rtoken);
        return rtoken;
    }

    static async verifyRefreshToken(refreshToken) {
        try {
            const data = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
            const user = await userService.findUser('_id', data.userId);
            if (!user || user.refreshToken !== refreshToken) {
                throw new Error('Invalid refresh token');
            }
            return data;
        } catch (error) {
            return { error: 'Invalid or expired refresh token' };
        }
    }
}

module.exports = authService;
