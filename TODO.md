# PawNest 后端开发任务

## 已完成

### 基础设施

- [x] 安装依赖: drizzle-orm, postgres, ioredis, nanoid, qiniu
- [x] 创建数据库 schema: common.ts, user.ts, pet.ts, adoption.ts, post.ts, comment.ts, favorite.ts, message.ts, chat.ts, banner.ts, report.ts, index.ts
- [x] 创建数据库连接 server/db/index.ts
- [x] 创建响应工具 server/utils/response.ts
- [x] 创建 Redis 工具 server/utils/redis.ts
- [x] 更新认证中间件，添加公开路由
- [x] 更新 nitro.config.ts 添加运行时配置
- [x] 数据库迁移配置: drizzle.config.ts, 迁移脚本

### 认证模块 `/api/auth`

- [x] server/utils/auth.ts — 登录/注册逻辑
- [x] server/api/auth/wx-login.post.ts — 微信登录
- [x] server/api/auth/phone-login.post.ts — 手机号登录
- [x] server/api/auth/send-code.post.ts — 发送验证码
- [x] server/api/auth/refresh.post.ts — 刷新 Token
- [x] server/api/auth/logout.post.ts — 退出登录

### 用户模块 `/api/users`

- [x] server/api/users/me.get.ts — 获取当前用户信息
- [x] server/api/users/me.put.ts — 更新用户信息
- [x] server/api/users/[id].get.ts — 获取用户公开信息
- [x] server/api/users/me/avatar.post.ts — 上传头像
- [x] server/api/users/me/stats.get.ts — 获取用户统计

### 宠物模块 `/api/pets`

- [x] server/api/pets/index.get.ts — 获取宠物列表
- [x] server/api/pets/index.post.ts — 发布宠物
- [x] server/api/pets/[id].get.ts — 获取宠物详情
- [x] server/api/pets/[id].put.ts — 更新宠物信息
- [x] server/api/pets/[id].delete.ts — 删除宠物
- [x] server/api/pets/recommended.get.ts — 获取推荐宠物
- [x] server/api/pets/nearby.get.ts — 获取附近宠物

### 领养模块 `/api/adoptions`

- [x] server/api/adoptions/index.post.ts — 提交领养申请
- [x] server/api/adoptions/me.get.ts — 我的申请列表
- [x] server/api/adoptions/[id].get.ts — 申请详情
- [x] server/api/adoptions/[id]/cancel.put.ts — 取消申请
- [x] server/api/adoptions/[id]/review.put.ts — 审核申请
- [x] server/api/adoptions/pet/[petId].get.ts — 宠物的申请列表

### 社区帖子模块 `/api/posts`

- [x] server/api/posts/index.get.ts — 获取帖子列表
- [x] server/api/posts/index.post.ts — 发布帖子
- [x] server/api/posts/[id].get.ts — 帖子详情
- [x] server/api/posts/[id].put.ts — 编辑帖子
- [x] server/api/posts/[id].delete.ts — 删除帖子
- [x] server/api/posts/[id]/like.post.ts — 点赞/取消点赞
- [x] server/api/posts/[id]/comments.get.ts — 获取评论

### 评论模块 `/api/comments`

- [x] server/api/comments/index.post.ts — 发表评论
- [x] server/api/comments/[id].delete.ts — 删除评论
- [x] server/api/comments/[id]/like.post.ts — 点赞评论

### 收藏模块 `/api/favorites`

- [x] server/api/favorites/index.get.ts — 我的收藏列表
- [x] server/api/favorites/index.post.ts — 添加收藏
- [x] server/api/favorites/[id].delete.ts — 取消收藏

### 消息模块 `/api/messages`

- [x] server/api/messages/index.get.ts — 消息列表
- [x] server/api/messages/unread-count.get.ts — 未读消息数
- [x] server/api/messages/[id]/read.put.ts — 标记已读
- [x] server/api/messages/read-all.put.ts — 全部已读

### Banner 模块 `/api/banners`

- [x] server/api/banners/index.get.ts — 获取 Banner 列表

### 文件上传 `/api/upload`

- [x] server/utils/qiniu.ts — 七牛云工具
- [x] server/api/upload/image.post.ts — 上传图片
- [x] server/api/upload/token.get.ts — 获取上传凭证

### 后台管理 `/api/admin`

- [x] server/api/admin/pets/index.get.ts — 宠物列表
- [x] server/api/admin/pets/[id]/review.put.ts — 审核宠物
- [x] server/api/admin/pets/[id]/offline.put.ts — 下架宠物
- [x] server/api/admin/users/index.get.ts — 用户列表
- [x] server/api/admin/users/[id]/ban.put.ts — 封禁用户
- [x] server/api/admin/posts/index.get.ts — 帖子列表
- [x] server/api/admin/posts/[id].delete.ts — 删除帖子
- [x] server/api/admin/reports/index.get.ts — 举报列表
- [x] server/api/admin/reports/[id]/handle.put.ts — 处理举报
- [x] server/api/admin/banners/index.post.ts — 创建 Banner
- [x] server/api/admin/banners/[id].put.ts — 更新 Banner
- [x] server/api/admin/banners/[id].delete.ts — 删除 Banner

### WebSocket 实时通信

- [x] server/plugins/websocket.ts — WebSocket 插件
- [x] 聊天消息收发
- [x] 在线状态管理

## 项目结构

```
server/
├── api/
│   ├── auth/          # 认证模块 (5 个接口)
│   ├── users/         # 用户模块 (5 个接口)
│   ├── pets/          # 宠物模块 (7 个接口)
│   ├── adoptions/     # 领养模块 (6 个接口)
│   ├── posts/         # 帖子模块 (7 个接口)
│   ├── comments/      # 评论模块 (3 个接口)
│   ├── favorites/     # 收藏模块 (3 个接口)
│   ├── messages/      # 消息模块 (4 个接口)
│   ├── banners/       # Banner 模块 (1 个接口)
│   ├── upload/        # 上传模块 (2 个接口)
│   └── admin/         # 后台管理 (12 个接口)
├── db/schema/         # 数据库表 (12 张表)
├── middleware/        # 认证中间件
├── utils/             # 工具函数 (jwt, auth, redis, response, qiniu)
└── plugins/           # WebSocket 插件
```

## API 接口汇总 (55 个)

| 模块      | 接口数 | 描述                            |
| --------- | ------ | ------------------------------- |
| auth      | 5      | 微信/手机登录、Token 刷新、退出 |
| users     | 5      | 用户信息 CRUD、统计             |
| pets      | 7      | 宠物发布、列表、推荐            |
| adoptions | 6      | 领养申请、审核                  |
| posts     | 7      | 帖子发布、点赞                  |
| comments  | 3      | 评论、点赞                      |
| favorites | 3      | 收藏管理                        |
| messages  | 4      | 系统消息                        |
| banners   | 1      | 轮播图                          |
| upload    | 2      | 文件上传                        |
| admin     | 12     | 后台管理                        |

## 待完成

- [ ] 前端对接测试
- [ ] 生产环境部署配置
