import { defineHandler } from 'nitro'
import { object, string } from 'zod'
import { sendSmsCode } from '~/utils/auth'
import { error, ErrorCodes, success } from '~/utils/response'

const schema = object({
  phone: string().regex(/^(\+?86)?1[3-9]\d{9}$/),
})

export default defineHandler(async (event) => {
  const body = schema.safeParse(await event.req.json())
  if (!body.success) {
    return error('手机号格式错误', ErrorCodes.BAD_REQUEST)
  }

  const { phone } = body.data

  const code = await sendSmsCode(phone)

  return success({ code }, '验证码已发送')
})
