import { defineHandler } from 'nitro'
import { object, string } from 'zod'
import {
  createUser,
  findUserByOpenId,
  generateTokens,
  updateUserLogin,
} from '~/utils/auth'
import { error, ErrorCodes, success } from '~/utils/response'

const schema = object({
  code: string(),
})

export default defineHandler(async (event) => {
  const body = schema.safeParse(await event.req.json())
  if (!body.success) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const { code } = body.data

  const openId = `wx_${code}`

  let user = await findUserByOpenId(openId)
  if (!user) {
    const newUser = await createUser({
      openId,
      nickname: '微信用户',
    })
    if (!newUser) {
      return error('创建用户失败', ErrorCodes.SYSTEM_ERROR)
    }
    user = newUser
  }

  if (user.status === 'banned') {
    return error('账号已被封禁', ErrorCodes.USER_BANNED)
  }

  await updateUserLogin(user.id)

  const tokens = generateTokens(user.id, user.role)

  return success({
    ...tokens,
    user: {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      phone: user.phone,
    },
  })
})
