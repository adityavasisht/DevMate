import { Request, Response, NextFunction } from 'express'
import { requireRole } from '../../middleware/role.middleware'

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

const mockNext: NextFunction = jest.fn()

describe('requireRole middleware', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call next() when user has the required role', () => {
    const req = {
      user: { userId: 'user-123', role: 'DEVELOPER' }
    } as Partial<Request>

    const res = mockResponse()
    const middleware = requireRole('DEVELOPER')

    middleware(req as Request, res as Response, mockNext)

    expect(mockNext).toHaveBeenCalledTimes(1)
  })

  it('should return 403 when user has wrong role', () => {
    const req = {
      user: { userId: 'user-123', role: 'DEVELOPER' }
    } as Partial<Request>

    const res = mockResponse()
    // Require COMPANY but user is DEVELOPER
    const middleware = requireRole('COMPANY')

    middleware(req as Request, res as Response, mockNext)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 when user is not authenticated', () => {
    const req = {} as Partial<Request> // no user property

    const res = mockResponse()
    const middleware = requireRole('DEVELOPER')

    middleware(req as Request, res as Response, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should allow access when user matches one of multiple required roles', () => {
    const req = {
      user: { userId: 'user-123', role: 'COMPANY' }
    } as Partial<Request>

    const res = mockResponse()
    // Allow both DEVELOPER and COMPANY
    const middleware = requireRole('DEVELOPER', 'COMPANY')

    middleware(req as Request, res as Response, mockNext)

    expect(mockNext).toHaveBeenCalledTimes(1)
  })

})