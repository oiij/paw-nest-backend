import { to } from 'await-to-js'
import { defineMiddleware, HTTPError } from 'nitro'
import { jwt } from '~/utils/jwt'

const PUBLIC_PATHS = [
  '/api/hello',
  '/api/zod',
  '/api/auth/',
  '/api/banners',
  '/api/pets/recommended',
  '/api/pets/nearby',
]

const PUBLIC_EXACT_PATHS = [
  '/api/pets',
]

export default defineMiddleware(async (event) => {
  const url = event.url.pathname

  const isPublic = PUBLIC_PATHS.some(path => url.startsWith(path))
    || PUBLIC_EXACT_PATHS.includes(url)

  if (!isPublic) {
    const token = (event.req.headers.get('authorization') || '').replace('Bearer ', '')
    if (!token) {
      throw new HTTPError('401', {
        status: 401,
        statusText: '未授权',
      })
    }
    const [err, res] = await to(jwt.verify(token))
    if (err) {
      throw new HTTPError('401', {
        status: 401,
        statusText: 'Token 无效或已过期',
      })
    }
    event.context._token = token
    event.context._userId = res.userId
    event.context._role = res.role
    event.context._permissions = []
  }
})
