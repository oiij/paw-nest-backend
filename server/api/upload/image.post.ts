import { nanoid } from 'nanoid'
import { defineHandler } from 'nitro'
import { getPublicUrl } from '~/utils/qiniu'
import { error, ErrorCodes, success } from '~/utils/response'

export default defineHandler(async (event) => {
  const formData = await event.req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return error('请选择文件', ErrorCodes.BAD_REQUEST)
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return error('不支持的文件类型', ErrorCodes.BAD_REQUEST)
  }

  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    return error('文件大小不能超过 10MB', ErrorCodes.BAD_REQUEST)
  }

  const ext = file.name.split('.').pop() || 'jpg'
  const key = `uploads/${nanoid(21)}.${ext}`

  const url = getPublicUrl(key)

  return success({
    url,
    key,
  })
})
