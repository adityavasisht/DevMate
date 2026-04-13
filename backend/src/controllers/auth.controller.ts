import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/db'
import { env } from '../config/env'
import { RegisterBody, LoginBody, JWTPayload } from '../types/auth.types'

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    // 1. Get data from request body
    const { email, password, role } = req.body as RegisterBody

    // 2. Validate required fields
    if (!email || !password || !role) {
      res.status(400).json({ message: 'Email, password and role are required' })
      return
    }

    // 3. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      res.status(409).json({ message: 'User with this email already exists' })
      return
    }

    // 4. Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // 5. Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role
      }
    })

    // 6. Generate JWT token
    const payload: JWTPayload = {
      userId: user.id,
      role: user.role
    }

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: '7d'
    } as jwt.SignOptions)

    // 7. Send response (never send password back)
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    // 1. Get data from request body
    const { email, password } = req.body as LoginBody

    // 2. Validate required fields
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' })
      return
    }

    // 3. Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' })
      return
    }

    // 4. Compare password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' })
      return
    }

    // 5. Generate JWT token
    const payload: JWTPayload = {
      userId: user.id,
      role: user.role
    }

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: '7d'
    } as jwt.SignOptions)

    // 6. Send response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}