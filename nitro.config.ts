import process from 'node:process'
import { defineConfig } from 'nitro'

export default defineConfig({
  serverDir: './server',
  devServer: {
    port: 5677,
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || '123456',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    dbUrl: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/paw_nest',
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: process.env.REDIS_PORT || '6379',
    redisPassword: process.env.REDIS_PASSWORD || '',
  },
  features: {
    websocket: true,
  },
})
