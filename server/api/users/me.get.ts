import { defineHandler } from 'nitro'
import { findUserById } from '~/utils/auth'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
  const userId = event.context._userId

  const user = await findUserById(userId)
  if (!user) {
    return error('用户不存在', ErrorCodes.USER_NOT_FOUND)
  }

  return success({
    id: user.id,
    nickname: user.nickname,
    avatar: user.avatar,
    phone: user.phone,
    gender: user.gender,
    city: user.city,
    bio: user.bio,
    role: user.role,
    createdAt: user.createdAt,
  })
})
