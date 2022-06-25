import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import User from '../models/User';

require('dotenv').config();

const APP_SECRET = process.env.APP_SECRET || '298fhwucd2887';
const APP_REFRESH_SECRET = process.env.APP_REFRESH_SECRET || 'jch2u6b2qi1u313298';

export const issueToken = async (user) => {
  const token = await jwt.sign({
    id: user.id,
    username: user.username,
    email: user.email,
  }, APP_SECRET);
  const refreshToken = await jwt.sign({
    id: user.id,
    username: user.username,
    email: user.email,
  }, APP_REFRESH_SECRET, { expiresIn: '7d' });
  return {
    token,
    refreshToken,
  };
};

export const getAuthUser = async (req, requiresAuth = false) => {
  const header = req.headers['authorization'];
  if (header) {
    const token = jwt.verify(header, APP_SECRET);
    console.log('TOKEN_DECODED', token);
    const authUser = await User.findById(token.id);
    if (!authUser) {
      throw new AuthenticationError('Invalid token, User authentication failed');
    }
    if (requiresAuth) {
      return authUser;
    }
    return null;
  }
};

export const getRefreshTokenUser = async (req) => {
  const header = req.headers['refresh_token'];
  if (header) {
    const token = jwt.verify(header, APP_REFRESH_SECRET);
    console.log('TOKEN_DECODED', token);
    const authUser = await User.findById(token.id);
    if (!authUser) {
      throw new AuthenticationError('Invalid refresh token, User authentication failed');
    }
    return authUser;
  }
};