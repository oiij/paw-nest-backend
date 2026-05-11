import { defineHandler } from 'nitro'
import { object, string } from 'zod'
import { findUserById, generateTokens } from '~/utils/auth'
import { jwt } from '~/utils/jwt'
import { error, ErrorCodes, success } from '~/utils/response'

const schema = object({
  refreshToken: string(),
})

export default defineHandler(async (event) => {
  const body = schema.safeParse(await event.req.json())
  if (!body.success) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const { refreshToken } = body.data

  try {
    const payload = await jwt.verify(refreshToken)

    if (payload.type !== 'refresh') {
      return error('Token 类型错误', ErrorCodes.TOKEN_EXPIRED)
    }

    const user = await findUserById(payload.userId)
    if (!user) {
      return error('用户不存在', ErrorCodes.USER_NOT_FOUND)
    }

    if (user.status === 'banned') {
      return error('账号已被封禁', ErrorCodes.USER_BANNED)
    }

    const tokens = generateTokens(user.id, user.role)

    return success(tokens)
  }
  catch {
    return error('Token 无效或已过期', ErrorCodes.TOKEN_EXPIRED)
  }
})
