import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { db } from '~/db'
import { users } from '~/db/schema'
import { jwt } from '~/utils/jwt'
import { cacheDel, cacheGet, CacheKeys, cacheSet } from '~/utils/redis'

export async function findUserByPhone(phone: string) {
  const result = await db.select().from(users).where(eq(users.phone, phone)).limit(1)
  return result[0] || null
}

export async function findUserByOpenId(openId: string) {
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1)
  return result[0] || null
}

export async function findUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1)
  return result[0] || null
}

export async function createUser(data: {
  openId: string
  nickname: string
  avatar?: string
  phone?: string
  unionId?: string
}) {
  const id = nanoid(21)
  const now = new Date()
  await db.insert(users).values({
    id,
    ...data,
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
  })
  return findUserById(id)
}

export async function updateUserLogin(userId: string) {
  await db.update(users)
    .set({ lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(users.id, userId))
}

export function generateTokens(userId: string, role: string) {
  const accessToken = jwt.sign(
    { userId, role },
    '2h',
  )
  const refreshToken = jwt.sign(
    { userId, role, type: 'refresh' },
    '30d',
  )
  return { accessToken, refreshToken }
}

export async function sendSmsCode(phone: string): Promise<string> {
  const cacheKey = CacheKeys.smsCode(phone)
  const existing = await cacheGet<string>(cacheKey)
  if (existing) {
    return existing
  }
  const code = Math.random().toString().slice(2, 8)
  await cacheSet(cacheKey, code, 300)
  return code
}

export async function verifySmsCode(phone: string, code: string): Promise<boolean> {
  const cacheKey = CacheKeys.smsCode(phone)
  const cached = await cacheGet<string>(cacheKey)
  if (!cached || cached !== code) {
    return false
  }
  await cacheDel(cacheKey)
  return true
}

export async function getLoginFailCount(phone: string): Promise<number> {
  const cacheKey = CacheKeys.loginFail(phone)
  const count = await cacheGet<number>(cacheKey)
  return count || 0
}

export async function incrementLoginFail(phone: string): Promise<number> {
  const cacheKey = CacheKeys.loginFail(phone)
  const count = await getLoginFailCount(phone)
  const newCount = count + 1
  await cacheSet(cacheKey, newCount, 1800)
  return newCount
}

export async function resetLoginFail(phone: string): Promise<void> {
  const cacheKey = CacheKeys.loginFail(phone)
  await cacheDel(cacheKey)
}
