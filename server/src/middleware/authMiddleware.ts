// server/src/middleware/authMiddleware.ts
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types'; // Import your custom AuthRequest interface

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Get token from header (usually "Bearer TOKEN")
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    // Ensure process.env.JWT_SECRET is defined in your .env
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };

    // Attach user ID to the request object
    req.userId = decoded.id;
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      // Token is invalid (e.g., malformed, expired)
      return res.status(401).json({ message: 'Token is not valid' });
    }
    console.error('Auth middleware error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export default authMiddleware;