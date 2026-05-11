# PawNest 后端开发文档

## 目录

- [1. 技术栈](#1-技术栈)
- [2. 项目结构](#2-项目结构)
- [3. 数据库设计](#3-数据库设计)
- [4. API 设计](#4-api-设计)
- [5. 认证与授权](#5-认证与授权)
- [6. 实时通信](#6-实时通信)
- [7. 文件存储](#7-文件存储)
- [8. 缓存策略](#8-缓存策略)
- [9. 部署方案](#9-部署方案)

---

## 1. 技术栈

### 核心框架

| 技术        | 版本  | 用途            |
| ----------- | ----- | --------------- |
| Nitro       | ^3.x  | 服务端框架      |
| TypeScript  | ^5.x  | 开发语言        |
| Drizzle ORM | ^0.38 | ORM             |
| PostgreSQL  | ^16.x | 主数据库        |
| Redis       | ^7.x  | 缓存 / 消息队列 |

### 依赖库

```json
{
  "nitropack": "^3.x",
  "drizzle-orm": "^0.38.x",
  "postgres": "^3.x",
  "ioredis": "^5.x",
  "jsonwebtoken": "^9.x",
  "bcryptjs": "^2.x",
  "zod": "^3.x",
  "socket.io": "^4.x",
  "qiniu": "^7.x",
  "nanoid": "^5.x"
}
```

### 开发依赖

```json
{
  "drizzle-kit": "^0.30.x",
  "@types/jsonwebtoken": "^9.x",
  "@types/bcryptjs": "^2.x"
}
```

---

## 2. 项目结构

```
paw-nest-backend/
├── drizzle/
│   └── migrations/            # 数据库迁移文件
├── server/
│   ├── api/                   # API 路由（Nitro 文件路由）
│   │   ├── auth/
│   │   │   ├── wx-login.post.ts
│   │   │   ├── phone-login.post.ts
│   │   │   ├── send-code.post.ts
│   │   │   ├── refresh.post.ts
│   │   │   └── logout.post.ts
│   │   ├── users/
│   │   │   ├── me.get.ts
│   │   │   ├── me.put.ts
│   │   │   ├── [id].get.ts
│   │   │   └── me/
│   │   │       ├── avatar.post.ts
│   │   │       └── stats.get.ts
│   │   ├── pets/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   ├── [id].delete.ts
│   │   │   ├── recommended.get.ts
│   │   │   └── nearby.get.ts
│   │   ├── adoptions/
│   │   │   ├── index.post.ts
│   │   │   ├── me.get.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id]/
│   │   │   │   ├── cancel.put.ts
│   │   │   │   └── review.put.ts
│   │   │   └── pet/
│   │   │       └── [petId].get.ts
│   │   ├── posts/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   ├── [id].delete.ts
│   │   │   ├── [id]/
│   │   │   │   ├── like.post.ts
│   │   │   │   └── comments.get.ts
│   │   ├── comments/
│   │   │   ├── index.post.ts
│   │   │   ├── [id].delete.ts
│   │   │   └── [id]/
│   │   │       └── like.post.ts
│   │   ├── favorites/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   └── [id].delete.ts
│   │   ├── messages/
│   │   │   ├── index.get.ts
│   │   │   ├── unread-count.get.ts
│   │   │   ├── [id]/
│   │   │   │   └── read.put.ts
│   │   │   └── read-all.put.ts
│   │   ├── banners/
│   │   │   └── index.get.ts
│   │   ├── upload/
│   │   │   ├── image.post.ts
│   │   │   └── token.get.ts
│   │   └── admin/
│   │       ├── pets/
│   │       │   ├── index.get.ts
│   │       │   ├── [id]/
│   │       │   │   ├── review.put.ts
│   │       │   │   └── offline.put.ts
│   │       ├── users/
│   │       │   ├── index.get.ts
│   │       │   └── [id]/
│   │       │       └── ban.put.ts
│   │       ├── posts/
│   │       │   ├── index.get.ts
│   │       │   └── [id].delete.ts
│   │       ├── reports/
│   │       │   ├── index.get.ts
│   │       │   └── [id]/
│   │       │       └── handle.put.ts
│   │       └── banners/
│   │           ├── index.post.ts
│   │           ├── [id].put.ts
│   │           └── [id].delete.ts
│   ├── db/
│   │   ├── schema.ts          # Drizzle 表结构定义
│   │   ├── index.ts           # 数据库连接
│   │   └── seed.ts            # 种子数据
│   ├── utils/
│   │   ├── auth.ts            # 认证工具
│   │   ├── jwt.ts             # JWT 工具
│   │   ├── redis.ts           # Redis 连接
│   │   ├── qiniu.ts           # 七牛云工具
│   │   ├── sms.ts             # 短信工具
│   │   ├── wechat.ts          # 微信工具
│   │   └── response.ts        # 响应工具
│   ├── middleware/
│   │   ├── auth.ts            # 认证中间件
│   │   └── logger.ts          # 日志中间件
│   ├── plugins/
│   │   └── websocket.ts       # WebSocket 插件
│   └── tasks/
│       └── cache-cleanup.ts   # 定时任务
├── drizzle.config.ts          # Drizzle 配置
├── .env                       # 环境变量
├── .env.example               # 环境变量示例
├── tsconfig.json              # TypeScript 配置
├── nitro.config.ts            # Nitro 配置
└── package.json
```

---

## 3. 数据库设计

### 3.1 ER 图关系

```
User (1) ──── (N) Pet          # 用户发布宠物
User (1) ──── (N) Adoption     # 用户申请领养
User (1) ──── (N) Post         # 用户发布帖子
User (1) ──── (N) Comment      # 用户评论
User (1) ──── (N) Favorite     # 用户收藏
User (1) ──── (N) Message      # 用户消息
Pet  (1) ──── (N) Adoption     # 宠物被申请
Pet  (1) ──── (N) Favorite     # 宠物被收藏
Post (1) ──── (N) Comment      # 帖子评论
Post (1) ──── (N) Favorite     # 帖子被收藏
```

### 3.2 Drizzle Schema 定义

#### 公共类型 `server/db/schema/common.ts`

```typescript
import { pgEnum } from 'drizzle-orm/pg-core'

// 用户角色
export const roleEnum = pgEnum('role', ['user', 'rescuer', 'admin'])

// 用户状态
export const userStatusEnum = pgEnum('user_status', ['active', 'banned', 'deleted'])

// 宠物物种
export const speciesEnum = pgEnum('species', ['cat', 'dog', 'other'])

// 宠物性别
export const petGenderEnum = pgEnum('pet_gender', ['male', 'female', 'unknown'])

// 宠物状态
export const petStatusEnum = pgEnum('pet_status', ['pending', 'available', 'adopted', 'offline'])

// 领养状态
export const adoptionStatusEnum = pgEnum('adoption_status', [
  'pending',
  'reviewing',
  'interview',
  'approved',
  'rejected',
  'completed',
  'cancelled',
])

// 居住类型
export const housingTypeEnum = pgEnum('housing_type', ['own', 'rent', 'shared'])

// 帖子类型
export const postTypeEnum = pgEnum('post_type', ['dynamic', 'story', 'knowledge', 'rescue'])

// 帖子状态
export const postStatusEnum = pgEnum('post_status', ['draft', 'published', 'hidden', 'deleted'])

// 评论状态
export const commentStatusEnum = pgEnum('comment_status', ['active', 'hidden', 'deleted'])

// 收藏类型
export const targetTypeEnum = pgEnum('target_type', ['pet', 'post'])

// 消息类型
export const messageTypeEnum = pgEnum('message_type', ['system', 'adoption', 'comment', 'like', 'activity'])

// 聊天消息类型
export const chatMessageTypeEnum = pgEnum('chat_message_type', ['text', 'image', 'emoji'])

// Banner 链接类型
export const linkTypeEnum = pgEnum('link_type', ['pet', 'post', 'url', 'page'])

// Banner 状态
export const bannerStatusEnum = pgEnum('banner_status', ['active', 'inactive'])
```

#### User 用户表 `server/db/schema/user.ts`

```typescript
import { index, pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { roleEnum, userStatusEnum } from './common'

export const users = pgTable('users', {
  id: varchar('id', { length: 21 }).primaryKey(), // nanoid
  openId: varchar('open_id', { length: 64 }).notNull().unique(),
  unionId: varchar('union_id', { length: 64 }),
  phone: varchar('phone', { length: 20 }).unique(),
  nickname: varchar('nickname', { length: 50 }).notNull(),
  avatar: text('avatar'),
  gender: varchar('gender', { length: 10 }).default('unknown'), // male/female/unknown
  city: varchar('city', { length: 50 }),
  bio: text('bio'),
  role: roleEnum('role').default('user').notNull(),
  status: userStatusEnum('status').default('active').notNull(),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, table => ({
  phoneIdx: index('users_phone_idx').on(table.phone),
  cityIdx: index('users_city_idx').on(table.city),
}))
```

#### Pet 宠物表 `server/db/schema/pet.ts`

```typescript
import {
  boolean,
  index,
  integer,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import { petGenderEnum, petStatusEnum, speciesEnum } from './common'
import { users } from './user'

export const pets = pgTable('pets', {
  id: varchar('id', { length: 21 }).primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  species: speciesEnum('species').notNull(),
  breed: varchar('breed', { length: 50 }),
  age: integer('age'), // 月
  gender: petGenderEnum('gender').notNull(),
  weight: real('weight'), // kg
  color: varchar('color', { length: 30 }),
  city: varchar('city', { length: 50 }).notNull(),
  district: varchar('district', { length: 50 }),
  description: text('description'),
  healthStatus: varchar('health_status', { length: 100 }),
  vaccinated: boolean('vaccinated').default(false).notNull(),
  dewormed: boolean('dewormed').default(false).notNull(),
  sterilized: boolean('sterilized').default(false).notNull(),
  status: petStatusEnum('status').default('pending').notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  adoptFee: integer('adopt_fee'), // 分
  publisherId: varchar('publisher_id', { length: 21 })
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, table => ({
  speciesStatusIdx: index('pets_species_status_idx').on(table.species, table.status),
  cityStatusIdx: index('pets_city_status_idx').on(table.city, table.status),
  publisherIdx: index('pets_publisher_idx').on(table.publisherId),
}))

export const petImages = pgTable('pet_images', {
  id: varchar('id', { length: 21 }).primaryKey(),
  url: text('url').notNull(),
  sort: integer('sort').default(0).notNull(),
  petId: varchar('pet_id', { length: 21 })
    .references(() => pets.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const petTags = pgTable('pet_tags', {
  id: varchar('id', { length: 21 }).primaryKey(),
  name: varchar('name', { length: 30 }).notNull(),
  petId: varchar('pet_id', { length: 21 })
    .references(() => pets.id, { onDelete: 'cascade' })
    .notNull(),
}, table => ({
  namePetUnique: uniqueIndex('pet_tags_name_pet_id_idx').on(table.name, table.petId),
}))
```

#### Adoption 领养申请表 `server/db/schema/adoption.ts`

```typescript
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import { adoptionStatusEnum, housingTypeEnum } from './common'
import { pets } from './pet'
import { users } from './user'

export const adoptions = pgTable('adoptions', {
  id: varchar('id', { length: 21 }).primaryKey(),
  userId: varchar('user_id', { length: 21 })
    .references(() => users.id)
    .notNull(),
  petId: varchar('pet_id', { length: 21 })
    .references(() => pets.id)
    .notNull(),
  status: adoptionStatusEnum('status').default('pending').notNull(),

  // 申请人信息
  applicantName: varchar('applicant_name', { length: 50 }).notNull(),
  applicantAge: integer('applicant_age').notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  wechat: varchar('wechat', { length: 50 }),

  // 居住信息
  city: varchar('city', { length: 50 }).notNull(),
  housingType: housingTypeEnum('housing_type').notNull(),

  // 养宠经验
  hasPetExp: boolean('has_pet_exp').default(false).notNull(),
  acceptSterilize: boolean('accept_sterilize').default(true).notNull(),
  dailyCareTime: integer('daily_care_time'),

  // 家庭情况
  familyAgree: boolean('family_agree').default(true).notNull(),
  allergy: boolean('allergy').default(false).notNull(),
  reason: text('reason'),

  // 审核信息
  reviewerId: varchar('reviewer_id', { length: 21 }),
  reviewNote: text('review_note'),
  reviewedAt: timestamp('reviewed_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, table => ({
  userPetUnique: uniqueIndex('adoptions_user_pet_idx').on(table.userId, table.petId),
  petStatusIdx: index('adoptions_pet_status_idx').on(table.petId, table.status),
}))
```

#### Post 社区帖子表 `server/db/schema/post.ts`

```typescript
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { postStatusEnum, postTypeEnum } from './common'
import { users } from './user'

export const posts = pgTable('posts', {
  id: varchar('id', { length: 21 }).primaryKey(),
  userId: varchar('user_id', { length: 21 })
    .references(() => users.id)
    .notNull(),
  title: varchar('title', { length: 200 }),
  content: text('content').notNull(),
  type: postTypeEnum('type').default('dynamic').notNull(),
  location: varchar('location', { length: 100 }),
  likeCount: integer('like_count').default(0).notNull(),
  commentCount: integer('comment_count').default(0).notNull(),
  favoriteCount: integer('favorite_count').default(0).notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  status: postStatusEnum('status').default('published').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, table => ({
  userCreatedIdx: index('posts_user_created_idx').on(table.userId, table.createdAt),
  typeStatusIdx: index('posts_type_status_idx').on(table.type, table.status),
}))

export const postImages = pgTable('post_images', {
  id: varchar('id', { length: 21 }).primaryKey(),
  url: text('url').notNull(),
  type: varchar('type', { length: 10 }).default('image').notNull(), // image/video
  sort: integer('sort').default(0).notNull(),
  postId: varchar('post_id', { length: 21 })
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const postTags = pgTable('post_tags', {
  id: varchar('id', { length: 21 }).primaryKey(),
  name: varchar('name', { length: 30 }).notNull(),
  postId: varchar('post_id', { length: 21 })
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
}, table => ({
  namePostUnique: index('post_tags_name_post_idx').on(table.name, table.postId),
}))
```

#### Comment 评论表 `server/db/schema/comment.ts`

```typescript
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { commentStatusEnum } from './common'
import { posts } from './post'
import { users } from './user'

export const comments = pgTable('comments', {
  id: varchar('id', { length: 21 }).primaryKey(),
  userId: varchar('user_id', { length: 21 })
    .references(() => users.id)
    .notNull(),
  postId: varchar('post_id', { length: 21 })
    .references(() => posts.id)
    .notNull(),
  parentId: varchar('parent_id', { length: 21 }),
  content: text('content').notNull(),
  likeCount: integer('like_count').default(0).notNull(),
  status: commentStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, table => ({
  postCreatedIdx: index('comments_post_created_idx').on(table.postId, table.createdAt),
}))
```

#### Favorite 收藏表 `server/db/schema/favorite.ts`

```typescript
import {
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import { targetTypeEnum } from './common'
import { users } from './user'

export const favorites = pgTable('favorites', {
  id: varchar('id', { length: 21 }).primaryKey(),
  userId: varchar('user_id', { length: 21 })
    .references(() => users.id)
    .notNull(),
  targetType: targetTypeEnum('target_type').notNull(),
  targetId: varchar('target_id', { length: 21 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, table => ({
  userTargetUnique: uniqueIndex('favorites_user_target_idx').on(
    table.userId,
    table.targetType,
    table.targetId,
  ),
  userIdx: index('favorites_user_idx').on(table.userId, table.targetType),
}))
```

#### Message 系统消息表 `server/db/schema/message.ts`

```typescript
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { messageTypeEnum } from './common'
import { users } from './user'

export const messages = pgTable('messages', {
  id: varchar('id', { length: 21 }).primaryKey(),
  senderId: varchar('sender_id', { length: 21 })
    .references(() => users.id)
    .notNull(),
  receiverId: varchar('receiver_id', { length: 21 })
    .references(() => users.id)
    .notNull(),
  type: messageTypeEnum('type').notNull(),
  title: varchar('title', { length: 200 }),
  content: text('content').notNull(),
  data: jsonb('data'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, table => ({
  receiverReadIdx: index('messages_receiver_read_idx').on(table.receiverId, table.isRead, table.createdAt),
}))
```

#### ChatMessage 聊天消息表 `server/db/schema/chat.ts`

```typescript
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import { chatMessageTypeEnum } from './common'
import { users } from './user'

export const chatRooms = pgTable('chat_rooms', {
  id: varchar('id', { length: 21 }).primaryKey(),
  user1Id: varchar('user1_id', { length: 21 })
    .references(() => users.id)
    .notNull(),
  user2Id: varchar('user2_id', { length: 21 })
    .references(() => users.id)
    .notNull(),
  lastMessage: text('last_message'),
  lastMessageAt: timestamp('last_message_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, table => ({
  usersUnique: uniqueIndex('chat_rooms_users_idx').on(table.user1Id, table.user2Id),
}))

export const chatMessages = pgTable('chat_messages', {
  id: varchar('id', { length: 21 }).primaryKey(),
  roomId: varchar('room_id', { length: 21 })
    .references(() => chatRooms.id)
    .notNull(),
  senderId: varchar('sender_id', { length: 21 })
    .references(() => users.id)
    .notNull(),
  type: chatMessageTypeEnum('type').default('text').notNull(),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, table => ({
  roomCreatedIdx: index('chat_messages_room_created_idx').on(table.roomId, table.createdAt),
}))
```

#### Banner 轮播图表 `server/db/schema/banner.ts`

```typescript
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { bannerStatusEnum, linkTypeEnum } from './common'

export const banners = pgTable('banners', {
  id: varchar('id', { length: 21 }).primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  image: text('image').notNull(),
  link: text('link'),
  linkType: linkTypeEnum('link_type'),
  sort: integer('sort').default(0).notNull(),
  status: bannerStatusEnum('status').default('active').notNull(),
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, table => ({
  statusSortIdx: index('banners_status_sort_idx').on(table.status, table.sort),
}))
```

#### 统一导出 `server/db/schema/index.ts`

```typescript
export * from './adoption'
export * from './banner'
export * from './chat'
export * from './comment'
export * from './common'
export * from './favorite'
export * from './message'
export * from './pet'
export * from './post'
export * from './user'
```

---

## 4. API 设计

### 4.1 认证模块 `/api/auth`

| 方法 | 路径                    | 描述       | 认证          |
| ---- | ----------------------- | ---------- | ------------- |
| POST | `/api/auth/wx-login`    | 微信登录   | 否            |
| POST | `/api/auth/phone-login` | 手机号登录 | 否            |
| POST | `/api/auth/send-code`   | 发送验证码 | 否            |
| POST | `/api/auth/refresh`     | 刷新 Token | Refresh Token |
| POST | `/api/auth/logout`      | 退出登录   | 是            |

#### POST `/api/auth/wx-login`

```typescript
// server/api/auth/wx-login.post.ts

// Request Body
type WxLoginBody = {
  code: string // wx.login() 获取的 code
}

// Response
type WxLoginResponse = {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    nickname: string
    avatar: string | null
    phone: string | null
  }
}
```

### 4.2 用户模块 `/api/users`

| 方法 | 路径                   | 描述             | 认证 |
| ---- | ---------------------- | ---------------- | ---- |
| GET  | `/api/users/me`        | 获取当前用户信息 | 是   |
| PUT  | `/api/users/me`        | 更新用户信息     | 是   |
| GET  | `/api/users/:id`       | 获取用户公开信息 | 否   |
| POST | `/api/users/me/avatar` | 上传头像         | 是   |
| GET  | `/api/users/me/stats`  | 获取用户统计     | 是   |

#### PUT `/api/users/me`

```typescript
// Request Body
type UpdateUserBody = {
  nickname?: string
  avatar?: string
  gender?: 'male' | 'female' | 'unknown'
  city?: string
  bio?: string
}
```

### 4.3 宠物模块 `/api/pets`

| 方法   | 路径                    | 描述         | 认证 |
| ------ | ----------------------- | ------------ | ---- |
| GET    | `/api/pets`             | 获取宠物列表 | 否   |
| GET    | `/api/pets/:id`         | 获取宠物详情 | 否   |
| POST   | `/api/pets`             | 发布宠物     | 是   |
| PUT    | `/api/pets/:id`         | 更新宠物信息 | 是   |
| DELETE | `/api/pets/:id`         | 删除宠物     | 是   |
| GET    | `/api/pets/recommended` | 获取推荐宠物 | 否   |
| GET    | `/api/pets/nearby`      | 获取附近宠物 | 否   |

#### GET `/api/pets`

```typescript
// Query Parameters
type PetListQuery = {
  page?: number // 默认 1
  pageSize?: number // 默认 10
  species?: 'cat' | 'dog' | 'other'
  city?: string
  ageMin?: number
  ageMax?: number
  gender?: 'male' | 'female'
  vaccinated?: boolean
  sterilized?: boolean
  status?: 'available'
  sort?: 'latest' | 'popular' | 'distance'
  keyword?: string
}

// Response
type PetListResponse = {
  list: PetItem[]
  total: number
  page: number
  pageSize: number
}

type PetItem = {
  id: string
  name: string
  species: string
  breed: string | null
  age: number | null
  gender: string
  city: string
  images: { url: string }[]
  tags: string[]
  isFavorited: boolean
  publisher: {
    id: string
    nickname: string
    avatar: string | null
  }
}
```

#### POST `/api/pets`

```typescript
// Request Body
type CreatePetBody = {
  name: string
  species: 'cat' | 'dog' | 'other'
  breed?: string
  age?: number
  gender: 'male' | 'female' | 'unknown'
  weight?: number
  color?: string
  city: string
  district?: string
  description?: string
  healthStatus?: string
  vaccinated?: boolean
  dewormed?: boolean
  sterilized?: boolean
  tags?: string[]
  images?: string[]
}
```

### 4.4 领养模块 `/api/adoptions`

| 方法 | 路径                        | 描述                     | 认证 |
| ---- | --------------------------- | ------------------------ | ---- |
| POST | `/api/adoptions`            | 提交领养申请             | 是   |
| GET  | `/api/adoptions/me`         | 我的申请列表             | 是   |
| GET  | `/api/adoptions/:id`        | 申请详情                 | 是   |
| PUT  | `/api/adoptions/:id/cancel` | 取消申请                 | 是   |
| GET  | `/api/adoptions/pet/:petId` | 宠物的申请列表（救助人） | 是   |
| PUT  | `/api/adoptions/:id/review` | 审核申请                 | 是   |

#### POST `/api/adoptions`

```typescript
// Request Body
type CreateAdoptionBody = {
  petId: string
  applicantName: string
  applicantAge: number
  phone: string
  wechat?: string
  city: string
  housingType: 'own' | 'rent' | 'shared'
  hasPetExp?: boolean
  acceptSterilize?: boolean
  dailyCareTime?: number
  familyAgree?: boolean
  allergy?: boolean
  reason?: string
}
```

#### PUT `/api/adoptions/:id/review`

```typescript
// Request Body
type ReviewAdoptionBody = {
  status: 'approved' | 'rejected'
  reviewNote?: string
}
```

### 4.5 社区帖子模块 `/api/posts`

| 方法   | 路径                      | 描述          | 认证 |
| ------ | ------------------------- | ------------- | ---- |
| GET    | `/api/posts`              | 获取帖子列表  | 否   |
| GET    | `/api/posts/:id`          | 帖子详情      | 否   |
| POST   | `/api/posts`              | 发布帖子      | 是   |
| PUT    | `/api/posts/:id`          | 编辑帖子      | 是   |
| DELETE | `/api/posts/:id`          | 删除帖子      | 是   |
| POST   | `/api/posts/:id/like`     | 点赞/取消点赞 | 是   |
| GET    | `/api/posts/:id/comments` | 获取评论      | 否   |

#### POST `/api/posts`

```typescript
// Request Body
type CreatePostBody = {
  title?: string
  content: string
  type?: 'dynamic' | 'story' | 'knowledge' | 'rescue'
  location?: string
  images?: { url: string, type?: 'image' | 'video' }[]
  tags?: string[]
}
```

### 4.6 评论模块 `/api/comments`

| 方法   | 路径                     | 描述     | 认证 |
| ------ | ------------------------ | -------- | ---- |
| POST   | `/api/comments`          | 发表评论 | 是   |
| DELETE | `/api/comments/:id`      | 删除评论 | 是   |
| POST   | `/api/comments/:id/like` | 点赞评论 | 是   |

#### POST `/api/comments`

```typescript
// Request Body
type CreateCommentBody = {
  postId: string
  parentId?: string
  content: string
}
```

### 4.7 收藏模块 `/api/favorites`

| 方法   | 路径                 | 描述         | 认证 |
| ------ | -------------------- | ------------ | ---- |
| POST   | `/api/favorites`     | 添加收藏     | 是   |
| DELETE | `/api/favorites/:id` | 取消收藏     | 是   |
| GET    | `/api/favorites`     | 我的收藏列表 | 是   |

#### POST `/api/favorites`

```typescript
// Request Body
type CreateFavoriteBody = {
  targetType: 'pet' | 'post'
  targetId: string
}
```

### 4.8 消息模块 `/api/messages`

| 方法 | 路径                         | 描述       | 认证 |
| ---- | ---------------------------- | ---------- | ---- |
| GET  | `/api/messages`              | 消息列表   | 是   |
| GET  | `/api/messages/unread-count` | 未读消息数 | 是   |
| PUT  | `/api/messages/:id/read`     | 标记已读   | 是   |
| PUT  | `/api/messages/read-all`     | 全部已读   | 是   |

### 4.9 Banner 模块 `/api/banners`

| 方法 | 路径           | 描述             | 认证 |
| ---- | -------------- | ---------------- | ---- |
| GET  | `/api/banners` | 获取 Banner 列表 | 否   |

### 4.10 文件上传 `/api/upload`

| 方法 | 路径                | 描述         | 认证 |
| ---- | ------------------- | ------------ | ---- |
| POST | `/api/upload/image` | 上传图片     | 是   |
| GET  | `/api/upload/token` | 获取上传凭证 | 是   |

#### POST `/api/upload/image`

```typescript
// Request: multipart/form-data (file: File)

// Response
type UploadResponse = {
  url: string
  key: string
}
```

### 4.11 后台管理 `/api/admin`

| 方法   | 路径                            | 描述                 | 认证  |
| ------ | ------------------------------- | -------------------- | ----- |
| GET    | `/api/admin/pets`               | 宠物列表（含待审核） | Admin |
| PUT    | `/api/admin/pets/:id/review`    | 审核宠物             | Admin |
| PUT    | `/api/admin/pets/:id/offline`   | 下架宠物             | Admin |
| GET    | `/api/admin/users`              | 用户列表             | Admin |
| PUT    | `/api/admin/users/:id/ban`      | 封禁用户             | Admin |
| GET    | `/api/admin/posts`              | 帖子列表             | Admin |
| DELETE | `/api/admin/posts/:id`          | 删除帖子             | Admin |
| GET    | `/api/admin/reports`            | 举报列表             | Admin |
| PUT    | `/api/admin/reports/:id/handle` | 处理举报             | Admin |
| POST   | `/api/admin/banners`            | 创建 Banner          | Admin |
| PUT    | `/api/admin/banners/:id`        | 更新 Banner          | Admin |
| DELETE | `/api/admin/banners/:id`        | 删除 Banner          | Admin |

---

## 5. 认证与授权

### 5.1 JWT Token 结构

```typescript
type JwtPayload = {
  sub: string // 用户 ID
  role: string // 用户角色
  iat: number // 签发时间
  exp: number // 过期时间
}
```

### 5.2 Token 策略

| Token         | 有效期 | 存储位置     |
| ------------- | ------ | ------------ |
| Access Token  | 2 小时 | 客户端内存   |
| Refresh Token | 30 天  | 客户端持久化 |

### 5.3 认证中间件 `server/middleware/auth.ts`

```typescript
import { createError, defineEventHandler } from 'h3'
import { verifyToken } from '../utils/jwt'

export default defineEventHandler(async (event) => {
  // 跳过不需要认证的路由
  const publicRoutes = ['/api/auth/', '/api/banners', '/api/pets']
  const path = getRequestURL(event).pathname
  if (publicRoutes.some(route => path.startsWith(route) && !path.includes('/me'))) {
    return
  }

  const authHeader = getRequestHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: '未授权' })
  }

  const token = authHeader.slice(7)
  try {
    const payload = verifyToken(token)
    event.context.auth = payload
  }
  catch {
    throw createError({ statusCode: 401, message: 'Token 无效或已过期' })
  }
})
```

### 5.4 权限矩阵

| 角色    | 用户     | 宠物     | 领养     | 帖子     | 后台 |
| ------- | -------- | -------- | -------- | -------- | ---- |
| user    | 读写自己 | 读全部   | 读写自己 | 读写自己 | 无   |
| rescuer | 读写自己 | 读写自己 | 审核     | 读写自己 | 无   |
| admin   | 读全部   | 读写全部 | 读写全部 | 读写全部 | 全部 |

---

## 6. 实时通信

### 6.1 WebSocket 事件

```typescript
// server/plugins/websocket.ts

// 客户端 → 服务端
type ClientEvents = {
  'auth': (token: string) => void
  'message:send': (data: SendMessageDto) => void
  'message:read': (messageId: string) => void
  'typing': (roomId: string) => void
}

// 服务端 → 客户端
type ServerEvents = {
  'message:receive': (message: ChatMessage) => void
  'message:read:ack': (messageId: string) => void
  'typing:notify': (roomId: string, userId: string) => void
  'notification': (notification: Notification) => void
}
```

### 6.2 聊天房间

- 房间 ID 由两个用户 ID 排序拼接生成
- 消息存储到 PostgreSQL，热点数据缓存到 Redis
- 在线状态通过 Redis Set 维护

---

## 7. 文件存储

### 7.1 七牛云配置 `server/utils/qiniu.ts`

```typescript
type QiniuConfig = {
  accessKey: string
  secretKey: string
  bucket: string
  domain: string
}
```

### 7.2 上传策略

- 图片：最大 10MB，支持 jpg/png/gif/webp
- 视频：最大 100MB，支持 mp4
- 自动压缩：图片宽度不超过 1920px
- 生成缩略图：300x300

---

## 8. 缓存策略

### 8.1 Redis 缓存 `server/utils/redis.ts`

| 数据     | 缓存 Key                  | 过期时间 |
| -------- | ------------------------- | -------- |
| 用户信息 | `user:{id}`               | 1 小时   |
| 宠物详情 | `pet:{id}`                | 30 分钟  |
| 推荐列表 | `pets:recommended:{city}` | 10 分钟  |
| Banner   | `banners`                 | 5 分钟   |
| 验证码   | `sms:{phone}`             | 5 分钟   |
| 登录失败 | `login:fail:{phone}`      | 30 分钟  |
| 在线状态 | `online:{userId}`         | 5 分钟   |

### 8.2 缓存更新策略

- 写操作：先更新数据库，再删除缓存
- 读操作：先读缓存，未命中则读数据库并写入缓存
- 定时任务：每天凌晨清理过期缓存

---

## 9. 部署方案

### 9.1 环境配置

```env
# .env
NODE_ENV=production
PORT=3000

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/paw_nest

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=30d

# Qiniu
QINIU_ACCESS_KEY=
QINIU_SECRET_KEY=
QINIU_BUCKET=paw-nest
QINIU_DOMAIN=https://cdn.example.com

# WeChat
WECHAT_APP_ID=
WECHAT_APP_SECRET=

# SMS
SMS_ACCESS_KEY=
SMS_ACCESS_SECRET=
SMS_SIGN_NAME=
SMS_TEMPLATE_CODE=
```

### 9.2 Drizzle 配置 `drizzle.config.ts`

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/db/schema/index.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

### 9.3 Nitro 配置 `nitro.config.ts`

```typescript
export default defineNitroConfig({
  srcDir: 'server',
  compatibilityDate: '2025-01-01',
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || '',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    qiniuAccessKey: process.env.QINIU_ACCESS_KEY || '',
    qiniuSecretKey: process.env.QINIU_SECRET_KEY || '',
    qiniuBucket: process.env.QINIU_BUCKET || '',
    qiniuDomain: process.env.QINIU_DOMAIN || '',
    wechatAppId: process.env.WECHAT_APP_ID || '',
    wechatAppSecret: process.env.WECHAT_APP_SECRET || '',
  },
  experimental: {
    websocket: true,
  },
})
```

### 9.4 Docker 部署

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/paw_nest
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: paw_nest
    volumes:
      - pg_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

volumes:
  pg_data:
  redis_data:
```

### 9.5 PM2 部署

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'paw-nest-api',
    script: '.output/server/index.mjs',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  }],
}
```

### 9.6 数据库迁移命令

```bash
# 生成迁移文件
npx drizzle-kit generate

# 执行迁移
npx drizzle-kit migrate

# 推送 schema（开发环境）
npx drizzle-kit push

# 打开 Drizzle Studio
npx drizzle-kit studio
```

---

## 附录：响应码规范

| Code | 描述         |
| ---- | ------------ |
| 0    | 成功         |
| 1001 | 未授权       |
| 1002 | Token 过期   |
| 1003 | 无权限       |
| 2001 | 参数错误     |
| 2002 | 数据不存在   |
| 2003 | 数据已存在   |
| 3001 | 用户不存在   |
| 3002 | 密码错误     |
| 3003 | 账号已封禁   |
| 4001 | 宠物不存在   |
| 4002 | 宠物已下架   |
| 5001 | 申请已存在   |
| 5002 | 申请状态错误 |
| 9999 | 系统错误     |
