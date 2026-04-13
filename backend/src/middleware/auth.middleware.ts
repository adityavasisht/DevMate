import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { JWTPayload } from '../types/auth.types'

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' })
      return
    }

    // 2. Extract token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1]

    // 3. Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload

    // 4. Attach user data to request
    req.user = decoded

    // 5. Move to next middleware or route handler
    next()

  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}