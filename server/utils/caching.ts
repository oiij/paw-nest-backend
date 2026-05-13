import { useRedis } from './redis'

export const userCache = useRedis('user', 3600)
export const petCache = useRedis('pet', 1800)
export const petRecommendedCache = useRedis('pet:recommended', 600)
export const bannersCache = useRedis('banners', 300)
export const smsCache = useRedis<string>('sms', 300)
export const loginFailCache = useRedis<number>('login:fail', 1800)
export const onlineCache = useRedis('online', 3000)
