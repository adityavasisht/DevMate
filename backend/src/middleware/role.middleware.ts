import { Request, Response, NextFunction } from 'express'

export const requireRole = (...roles: ('DEVELOPER' | 'COMPANY')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.user is set by authenticate middleware
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        message: `Access denied. Required role: ${roles.join(' or ')}` 
      })
      return
    }

    next()
  }
}