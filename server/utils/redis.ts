/* eslint-disable no-console */
import process from 'node:process'
import Redis from 'ioredis'

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  db: 0,
})

redis.on('error', (err) => {
  console.error('Redis connection error:', err)
})

redis.on('connect', () => {
  console.log('Redis connected')
})

export function useRedis<R = string>(prefix: string, baseTTL?: number) {
  async function get<T = R>(key: string) {
    const data = await redis.get(`${prefix}:${key}`)
    if (!data) {
      return null
    }
    try {
      return JSON.parse(data) as T
    }
    catch {
      return data as T
    }
  }
  async function set<T = R>(key: string, value: T, ttl?: number) {
    const data = typeof value === 'string' ? value : JSON.stringify(value)
    const TTL = ttl || baseTTL
    if (TTL) {
      await redis.set(`${prefix}:${key}`, data, 'EX', TTL)
    }
    else {
      await redis.set(`${prefix}:${key}`, data)
    }
  }
  async function del(key: string) {
    await redis.del(`${prefix}:${key}`)
  }
  async function exists(key: string) {
    return await redis.exists(`${prefix}:${key}`)
  }
  async function keys() {
    return await redis.keys(`${prefix}:*`)
  }

  return {
    redis,
    prefix,
    get,
    set,
    del,
    exists,
    keys,
  }
}
