import { defineHandler } from 'nitro'
import { success } from '~/utils/response'

export default defineHandler(async () => {
  return success(null, '已退出登录')
})
