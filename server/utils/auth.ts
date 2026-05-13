import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { users } from '~/db/schema'
import { loginFailCache, smsCache } from '~/utils/caching'
import { jwt } from '~/utils/jwt'

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
  const now = new Date()
  const result = await db.insert(users).values({
    ...data,
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
  }).returning({ id: users.id })
  return findUserById(result[0]!.id)
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
  const existing = await smsCache.get(phone)
  if (existing) {
    return existing
  }
  const code = Math.random().toString().slice(2, 8)

  await smsCache.set(phone, code)
  return code
}

export async function verifySmsCode(phone: string, code: string): Promise<boolean> {
  const cached = await smsCache.get(phone)

  if (!cached || `${cached}` !== code) {
    return false
  }
  await smsCache.del(phone)
  return true
}

export async function getLoginFailCount(phone: string): Promise<number> {
  const count = await loginFailCache.get(phone)
  return count || 0
}

export async function incrementLoginFail(phone: string): Promise<number> {
  const count = await getLoginFailCount(phone)
  const newCount = count + 1
  await loginFailCache.set(phone, newCount)
  return newCount
}

export async function resetLoginFail(phone: string): Promise<void> {
  await loginFailCache.del(phone)
}
