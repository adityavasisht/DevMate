import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { authenticate } from '../../middleware/auth.middleware'

jest.mock('../../config/env', () => ({
  env: {
    JWT_SECRET: 'test_secret_key_for_testing',
    JWT_EXPIRES_IN: '7d',
  },
}))

const mockRequest = (authHeader?: string): Partial<Request> => ({
  headers: {
    authorization: authHeader,
  },
})

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

const mockNext: NextFunction = jest.fn()

describe('authenticate middleware', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call next() when token is valid', () => {
    const payload = { userId: 'user-123', role: 'DEVELOPER' }
    const token = jwt.sign(payload, 'test_secret_key_for_testing')

    const req = mockRequest(`Bearer ${token}`)
    const res = mockResponse()

    authenticate(req as Request, res as Response, mockNext)

    expect(mockNext).toHaveBeenCalledTimes(1)
    expect((req as any).user).toBeDefined()
    expect((req as any).user.userId).toBe('user-123')
  })

  it('should return 401 when no token is provided', () => {
    const req = mockRequest()
    const res = mockResponse()

    authenticate(req as Request, res as Response, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 when token does not start with Bearer', () => {
    const req = mockRequest('InvalidToken abc123')
    const res = mockResponse()

    authenticate(req as Request, res as Response, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 when token is expired', () => {
    const payload = { userId: 'user-123', role: 'DEVELOPER' }
    const token = jwt.sign(payload, 'test_secret_key_for_testing', { expiresIn: '0s' })

    const req = mockRequest(`Bearer ${token}`)
    const res = mockResponse()

    authenticate(req as Request, res as Response, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 when token has wrong secret', () => {
    const payload = { userId: 'user-123', role: 'DEVELOPER' }
    const token = jwt.sign(payload, 'wrong_secret')

    const req = mockRequest(`Bearer ${token}`)
    const res = mockResponse()

    authenticate(req as Request, res as Response, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' })
    expect(mockNext).not.toHaveBeenCalled()
  })

})
