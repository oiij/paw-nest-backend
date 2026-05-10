import { to } from 'await-to-js'
import { defineMiddleware, HTTPError } from 'nitro'
import { jwt } from '~/utils/jwt'

const PUBLIC_PATHS = [
  '/api/hello',
  '/api/zod',
]

export default defineMiddleware(async (event) => {
  const url = event.url.pathname
  if (!PUBLIC_PATHS.some(path => url.startsWith(path))) {
    const token = (event.req.headers.get('authorization') || '').replace('Bearer ', '')
    const [err, res] = await to(jwt.verify(token))
    if (err) {
      throw new HTTPError('401', {
        status: 401,
        statusText: '未授权',
      })
    }
    event.context._token = token
    event.context._userId = res.userId
    event.context._username = res.username
    event.context._permissions = []
  }
})
