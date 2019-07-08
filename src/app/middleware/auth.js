import jwt from 'jsonwebtoken';

import { promisify } from 'util';

import authConfig from '../../config/authConfig';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'Token not found' });

  const [, token] = authHeader.split(' ');

  try {
    const decode = await promisify(jwt.verify)(token, authConfig.hash);

    req.userId = decode.id;

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
};
