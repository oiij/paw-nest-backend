import { nanoid } from 'nanoid'
import { defineHandler } from 'nitro'
import { getUploadToken } from '~/utils/qiniu'
import { success } from '~/utils/response'

export default defineHandler(async (event) => {
  const prefix = event.url.searchParams.get('prefix') || 'uploads'

  const key = `${prefix}/${nanoid(21)}`
  const token = getUploadToken(key)

  return success({
    token,
    key,
  })
})
