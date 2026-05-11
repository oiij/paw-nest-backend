import { pgEnum } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['user', 'rescuer', 'admin'])

export const userStatusEnum = pgEnum('user_status', ['active', 'banned', 'deleted'])

export const speciesEnum = pgEnum('species', ['cat', 'dog', 'other'])

export const petGenderEnum = pgEnum('pet_gender', ['male', 'female', 'unknown'])

export const petStatusEnum = pgEnum('pet_status', ['pending', 'available', 'adopted', 'offline'])

export const adoptionStatusEnum = pgEnum('adoption_status', [
  'pending',
  'reviewing',
  'interview',
  'approved',
  'rejected',
  'completed',
  'cancelled',
])

export const housingTypeEnum = pgEnum('housing_type', ['own', 'rent', 'shared'])

export const postTypeEnum = pgEnum('post_type', ['dynamic', 'story', 'knowledge', 'rescue'])

export const postStatusEnum = pgEnum('post_status', ['draft', 'published', 'hidden', 'deleted'])

export const commentStatusEnum = pgEnum('comment_status', ['active', 'hidden', 'deleted'])

export const targetTypeEnum = pgEnum('target_type', ['pet', 'post'])

export const messageTypeEnum = pgEnum('message_type', ['system', 'adoption', 'comment', 'like', 'activity'])

export const chatMessageTypeEnum = pgEnum('chat_message_type', ['text', 'image', 'emoji'])

export const linkTypeEnum = pgEnum('link_type', ['pet', 'post', 'url', 'page'])

export const bannerStatusEnum = pgEnum('banner_status', ['active', 'inactive'])
