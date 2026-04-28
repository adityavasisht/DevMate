import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { env } from './config/env'
import prisma from './config/db'
import { connectRedis } from './config/redis'
import { initializeSocket } from './config/socket'
import { swaggerSpec } from './config/swagger'
import authRoutes from './routes/auth.routes'
import profileRoutes from './routes/profile.routes'
import jobRoutes from './routes/job.routes'
import matchRoutes from './routes/match.routes'
import applicationRoutes from './routes/application.routes'

const app = express()
const httpServer = createServer(app)

initializeSocket(httpServer)

app.use(cors())
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api/auth', authRoutes)
app.use('/api/profiles', profileRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/applications', applicationRoutes)

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({
      status: 'ok',
      message: 'DevMate API is running',
      database: 'connected',
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      database: 'disconnected',
    })
  }
})

const startServer = async () => {
  await connectRedis()
  httpServer.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`)
    console.log(`📚 Swagger docs at http://localhost:${env.PORT}/api-docs`)
  })
}

startServer()
