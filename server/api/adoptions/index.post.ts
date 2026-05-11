import { and, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { defineHandler } from 'nitro'
import { boolean, number, object, optional, string } from 'zod'
import { db } from '~/db'
import { adoptions, pets } from '~/db/schema'
import { error, ErrorCodes, success } from '~/utils/response'

const schema = object({
  petId: string(),
  applicantName: string().min(1).max(50),
  applicantAge: number().min(1).max(120),
  phone: string().length(11),
  wechat: optional(string().max(50)),
  city: string().max(50),
  housingType: string(),
  hasPetExp: optional(boolean()),
  acceptSterilize: optional(boolean()),
  dailyCareTime: optional(number()),
  familyAgree: optional(boolean()),
  allergy: optional(boolean()),
  reason: optional(string()),
})

export default defineHandler(async (event) => {
  const userId = event.context._userId

  const body = schema.safeParse(await event.req.json())
  if (!body.success) {
    return error('参数错误', ErrorCodes.BAD_REQUEST)
  }

  const data = body.data

  const [pet] = await db
    .select()
    .from(pets)
    .where(eq(pets.id, data.petId))
    .limit(1)

  if (!pet) {
    return error('宠物不存在', ErrorCodes.PET_NOT_FOUND)
  }

  if (pet.status !== 'available') {
    return error('宠物当前不可领养', ErrorCodes.PET_OFFLINE)
  }

  const [existing] = await db
    .select()
    .from(adoptions)
    .where(and(eq(adoptions.userId, userId), eq(adoptions.petId, data.petId)))
    .limit(1)

  if (existing) {
    return error('您已提交过申请', ErrorCodes.ADOPTION_EXISTS)
  }

  const id = nanoid(21)
  const now = new Date()

  await db.insert(adoptions).values({
    id,
    userId,
    petId: data.petId,
    applicantName: data.applicantName,
    applicantAge: data.applicantAge,
    phone: data.phone,
    wechat: data.wechat,
    city: data.city,
    housingType: data.housingType as any,
    hasPetExp: data.hasPetExp ?? false,
    acceptSterilize: data.acceptSterilize ?? true,
    dailyCareTime: data.dailyCareTime,
    familyAgree: data.familyAgree ?? true,
    allergy: data.allergy ?? false,
    reason: data.reason,
    createdAt: now,
    updatedAt: now,
  })

  return success({ id }, '申请提交成功')
})
