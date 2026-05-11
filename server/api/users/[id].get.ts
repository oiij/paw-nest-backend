import { defineHandler } from 'nitro'
import { findUserById } from '~/utils/auth'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const user = await findUserById(id)
  if (!user) {
    return error('用户不存在', ErrorCodes.USER_NOT_FOUND)
  }

  return success({
    id: user.id,
    nickname: user.nickname,
    avatar: user.avatar,
    gender: user.gender,
    city: user.city,
    bio: user.bio,
    createdAt: user.createdAt,
  })
})
