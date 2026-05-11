import process from 'node:process'
import Redis from 'ioredis'

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: Number(process.env.REDIS_DB) || 0,
}

export const redis = new Redis(redisConfig)

redis.on('error', (err) => {
  console.error('Redis connection error:', err)
})

redis.on('connect', () => {
})

export async function cacheGet<T>(key: string): Promise<T | null> {
  const data = await redis.get(key)
  if (!data)
    return null
  try {
    return JSON.parse(data) as T
  }
  catch {
    return data as T
  }
}

export async function cacheSet(key: string, value: any, ttl?: number): Promise<void> {
  const data = typeof value === 'string' ? value : JSON.stringify(value)
  if (ttl) {
    await redis.set(key, data, 'EX', ttl)
  }
  else {
    await redis.set(key, data)
  }
}

export async function cacheDel(key: string): Promise<void> {
  await redis.del(key)
}

export async function cacheDelPattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}

export const CacheKeys = {
  user: (id: string) => `user:${id}`,
  pet: (id: string) => `pet:${id}`,
  petRecommended: (city: string) => `pets:recommended:${city}`,
  banners: 'banners',
  smsCode: (phone: string) => `sms:${phone}`,
  loginFail: (phone: string) => `login:fail:${phone}`,
  online: (userId: string) => `online:${userId}`,
} as const

export const CacheTTL = {
  user: 3600,
  pet: 1800,
  petRecommended: 600,
  banners: 300,
  smsCode: 300,
  loginFail: 1800,
  online: 300,
} as const
