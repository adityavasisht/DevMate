import { createClient } from 'redis'
import { env } from './env'

// Create Redis client
const redisClient = createClient({
  url: env.REDIS_URL
})

// Log errors
redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err)
})

// Log successful connection
redisClient.on('connect', () => {
  console.log('✅ Redis connected')
})

// Connect to Redis
export const connectRedis = async () => {
  await redisClient.connect()
}

export default redisClient