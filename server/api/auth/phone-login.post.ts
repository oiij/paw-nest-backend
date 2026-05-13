import { defineHandler } from 'nitro'
import { object, string } from 'zod'
import {
  createUser,
  findUserByPhone,
  generateTokens,
  getLoginFailCount,
  incrementLoginFail,
  resetLoginFail,
  updateUserLogin,
  verifySmsCode,
} from '~/utils/auth'
import { error, ErrorCodes, success } from '~/utils/response'

const schema = object({
  phone: string().regex(/^(\+?86)?1[3-9]\d{9}$/),
  code: string().length(6),
})

export default defineHandler(async (event) => {
  const body = schema.safeParse(await event.req.json())
  if (!body.success) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const { phone, code } = body.data

  const failCount = await getLoginFailCount(phone)
  if (failCount >= 5) {
    return error('登录失败次数过多，请稍后再试', ErrorCodes.TOO_MANY_REQUESTS)
  }

  const isValid = await verifySmsCode(phone, code)
  if (!isValid) {
    await incrementLoginFail(phone)
    return error('验证码错误', ErrorCodes.BAD_REQUEST)
  }

  await resetLoginFail(phone)

  let user = await findUserByPhone(phone)
  if (!user) {
    const newUser = await createUser({
      openId: `phone_${phone}`,
      nickname: `用户${phone.slice(-4)}`,
      phone,
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
