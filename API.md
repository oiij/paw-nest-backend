# PawNest API 接口文档

## 基础信息

- Base URL: `/api`
- 认证方式: Bearer Token (Header: `Authorization: Bearer <token>`)
- 响应格式: JSON

### 响应结构

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 错误码

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
| 4290 | 请求过于频繁 |
| 9999 | 系统错误     |

---

## 1. 认证模块 `/api/auth`

### 1.1 发送验证码

```
POST /api/auth/send-code
```

**请求体:**

```json
{
  "phone": "13800138000"
}
```

**响应:**

```json
{
  "code": 0,
  "message": "验证码已发送",
  "data": {
    "code": "123456"
  }
}
```

### 1.2 手机号登录

```
POST /api/auth/phone-login
```

**请求体:**

```json
{
  "phone": "13800138000",
  "code": "123456"
}
```

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "abc123xyz",
      "nickname": "用户8000",
      "avatar": null,
      "phone": "13800138000"
    }
  }
}
```

### 1.3 微信登录

```
POST /api/auth/wx-login
```

**请求体:**

```json
{
  "code": "wx_login_code"
}
```

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {
      "id": "abc123xyz",
      "nickname": "微信用户",
      "avatar": null,
      "phone": null
    }
  }
}
```

### 1.4 刷新 Token

```
POST /api/auth/refresh
```

**请求体:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### 1.5 退出登录

```
POST /api/auth/logout
Authorization: Bearer <token>
```

**响应:**

```json
{
  "code": 0,
  "message": "已退出登录",
  "data": null
}
```

---

## 2. 用户模块 `/api/users`

### 2.1 获取当前用户信息

```
GET /api/users/me
Authorization: Bearer <token>
```

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "abc123xyz",
    "nickname": "用户8000",
    "avatar": "https://cdn.example.com/avatars/abc.jpg",
    "phone": "13800138000",
    "gender": "unknown",
    "city": null,
    "bio": null,
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2.2 更新用户信息

```
PUT /api/users/me
Authorization: Bearer <token>
```

**请求体:**

```json
{
  "nickname": "新昵称",
  "gender": "male",
  "city": "北京",
  "bio": "个人简介"
}
```

**响应:**

```json
{
  "code": 0,
  "message": "更新成功",
  "data": null
}
```

### 2.3 获取用户公开信息

```
GET /api/users/:id
```

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "abc123xyz",
    "nickname": "用户8000",
    "avatar": "https://cdn.example.com/avatars/abc.jpg",
    "gender": "male",
    "city": "北京",
    "bio": "个人简介",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2.4 上传头像

```
POST /api/users/me/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**表单字段:**

- `avatar`: File (图片文件)

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "avatar": "https://cdn.example.com/avatars/abc.jpg"
  }
}
```

### 2.5 获取用户统计

```
GET /api/users/me/stats
Authorization: Bearer <token>
```

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "petCount": 5,
    "postCount": 12,
    "adoptionCount": 3
  }
}
```

---

## 3. 宠物模块 `/api/pets`

### 3.1 获取宠物列表

```
GET /api/pets?page=1&pageSize=10&species=cat&city=北京&gender=male&status=available&keyword=英短
```

**查询参数:**

| 参数     | 类型   | 必填 | 说明                                    |
| -------- | ------ | ---- | --------------------------------------- |
| page     | number | 否   | 页码，默认 1                            |
| pageSize | number | 否   | 每页数量，默认 10                       |
| species  | string | 否   | 物种: cat/dog/other                     |
| city     | string | 否   | 城市                                    |
| gender   | string | 否   | 性别: male/female                       |
| status   | string | 否   | 状态: pending/available/adopted/offline |
| keyword  | string | 否   | 关键词搜索                              |

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "pet123",
        "name": "小橘",
        "species": "cat",
        "breed": "英短",
        "age": 12,
        "gender": "male",
        "city": "北京",
        "status": "available",
        "viewCount": 100,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "publisher": {
          "id": "user123",
          "nickname": "救助人",
          "avatar": "https://..."
        },
        "images": [
          { "url": "https://cdn.example.com/pet1.jpg" }
        ],
        "tags": ["已绝育", "已疫苗"]
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 10
  }
}
```

### 3.2 获取宠物详情

```
GET /api/pets/:id
```

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "pet123",
    "name": "小橘",
    "species": "cat",
    "breed": "英短",
    "age": 12,
    "gender": "male",
    "weight": 4.5,
    "color": "橘色",
    "city": "北京",
    "district": "朝阳区",
    "description": "性格温顺...",
    "healthStatus": "健康",
    "vaccinated": true,
    "dewormed": true,
    "sterilized": true,
    "status": "available",
    "viewCount": 101,
    "adoptFee": null,
    "publisherId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "publisher": {
      "id": "user123",
      "nickname": "救助人",
      "avatar": "https://..."
    },
    "images": [
      { "url": "https://cdn.example.com/pet1.jpg" },
      { "url": "https://cdn.example.com/pet2.jpg" }
    ],
    "tags": ["已绝育", "已疫苗"]
  }
}
```

### 3.3 发布宠物

```
POST /api/pets
Authorization: Bearer <token>
```

**请求体:**

```json
{
  "name": "小橘",
  "species": "cat",
  "breed": "英短",
  "age": 12,
  "gender": "male",
  "weight": 4.5,
  "color": "橘色",
  "city": "北京",
  "district": "朝阳区",
  "description": "性格温顺...",
  "healthStatus": "健康",
  "vaccinated": true,
  "dewormed": true,
  "sterilized": true,
  "tags": ["已绝育", "已疫苗"],
  "images": ["https://cdn.example.com/pet1.jpg"]
}
```

**响应:**

```json
{
  "code": 0,
  "message": "发布成功",
  "data": {
    "id": "pet123"
  }
}
```

### 3.4 更新宠物信息

```
PUT /api/pets/:id
Authorization: Bearer <token>
```

**请求体:** (同发布，所有字段可选)

**响应:**

```json
{
  "code": 0,
  "message": "更新成功",
  "data": null
}
```

### 3.5 删除宠物

```
DELETE /api/pets/:id
Authorization: Bearer <token>
```

**响应:**

```json
{
  "code": 0,
  "message": "删除成功",
  "data": null
}
```

### 3.6 获取推荐宠物

```
GET /api/pets/recommended?city=北京&limit=10
```

**查询参数:**

| 参数  | 类型   | 必填 | 说明          |
| ----- | ------ | ---- | ------------- |
| city  | string | 否   | 城市          |
| limit | number | 否   | 数量，默认 10 |

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "pet123",
      "name": "小橘",
      "species": "cat",
      "breed": "英短",
      "age": 12,
      "gender": "male",
      "city": "北京",
      "viewCount": 100,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "publisher": { "id": "user123", "nickname": "救助人", "avatar": "..." },
      "images": [{ "url": "..." }],
      "tags": ["已绝育"]
    }
  ]
}
```

### 3.7 获取附近宠物

```
GET /api/pets/nearby?city=北京&limit=10
```

**参数同推荐宠物**

---

## 4. 领养模块 `/api/adoptions`

### 4.1 提交领养申请

```
POST /api/adoptions
Authorization: Bearer <token>
```

**请求体:**

```json
{
  "petId": "pet123",
  "applicantName": "张三",
  "applicantAge": 25,
  "phone": "13800138000",
  "wechat": "zhangsan_wx",
  "city": "北京",
  "housingType": "own",
  "hasPetExp": true,
  "acceptSterilize": true,
  "dailyCareTime": 4,
  "familyAgree": true,
  "allergy": false,
  "reason": "很喜欢猫咪..."
}
```

**字段说明:**

| 字段            | 类型    | 必填 | 说明                      |
| --------------- | ------- | ---- | ------------------------- |
| petId           | string  | 是   | 宠物 ID                   |
| applicantName   | string  | 是   | 申请人姓名                |
| applicantAge    | number  | 是   | 年龄                      |
| phone           | string  | 是   | 手机号                    |
| wechat          | string  | 否   | 微信号                    |
| city            | string  | 是   | 所在城市                  |
| housingType     | string  | 是   | 居住类型: own/rent/shared |
| hasPetExp       | boolean | 否   | 是否有养宠经验            |
| acceptSterilize | boolean | 否   | 是否接受绝育              |
| dailyCareTime   | number  | 否   | 每日照顾时间(小时)        |
| familyAgree     | boolean | 否   | 家人是否同意              |
| allergy         | boolean | 否   | 是否过敏                  |
| reason          | string  | 否   | 领养原因                  |

**响应:**

```json
{
  "code": 0,
  "message": "申请提交成功",
  "data": {
    "id": "adoption123"
  }
}
```

### 4.2 我的申请列表

```
GET /api/adoptions/me?page=1&pageSize=10&status=pending
Authorization: Bearer <token>
```

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "adoption123",
        "status": "pending",
        "applicantName": "张三",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "pet": {
          "id": "pet123",
          "name": "小橘",
          "species": "cat",
          "city": "北京",
          "image": "https://..."
        }
      }
    ],
    "page": 1,
    "pageSize": 10
  }
}
```

### 4.3 申请详情

```
GET /api/adoptions/:id
Authorization: Bearer <token>
```

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "adoption123",
    "userId": "user123",
    "petId": "pet123",
    "status": "pending",
    "applicantName": "张三",
    "applicantAge": 25,
    "phone": "13800138000",
    "wechat": "zhangsan_wx",
    "city": "北京",
    "housingType": "own",
    "hasPetExp": true,
    "acceptSterilize": true,
    "dailyCareTime": 4,
    "familyAgree": true,
    "allergy": false,
    "reason": "很喜欢猫咪...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "pet": {
      "id": "pet123",
      "name": "小橘",
      "species": "cat",
      "breed": "英短",
      "city": "北京"
    }
  }
}
```

### 4.4 取消申请

```
PUT /api/adoptions/:id/cancel
Authorization: Bearer <token>
```

**响应:**

```json
{
  "code": 0,
  "message": "已取消申请",
  "data": null
}
```

### 4.5 审核申请 (救助人)

```
PUT /api/adoptions/:id/review
Authorization: Bearer <token>
```

**请求体:**

```json
{
  "status": "approved",
  "reviewNote": "条件符合，欢迎领养"
}
```

**字段说明:**

- status: `approved` (通过) / `rejected` (拒绝)

**响应:**

```json
{
  "code": 0,
  "message": "已通过",
  "data": null
}
```

### 4.6 宠物的申请列表 (救助人)

```
GET /api/adoptions/pet/:petId
Authorization: Bearer <token>
```

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "adoption123",
      "status": "pending",
      "applicantName": "张三",
      "applicantAge": 25,
      "phone": "13800138000",
      "city": "北京",
      "housingType": "own",
      "reason": "很喜欢猫咪...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": "user123",
        "nickname": "张三",
        "avatar": "https://..."
      }
    }
  ]
}
```

---

## 5. 社区帖子模块 `/api/posts`

### 5.1 获取帖子列表

```
GET /api/posts?page=1&pageSize=10&type=dynamic&keyword=猫咪
```

**查询参数:**

| 参数     | 类型   | 必填 | 说明                                 |
| -------- | ------ | ---- | ------------------------------------ |
| page     | number | 否   | 页码                                 |
| pageSize | number | 否   | 每页数量                             |
| type     | string | 否   | 类型: dynamic/story/knowledge/rescue |
| keyword  | string | 否   | 关键词                               |

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "post123",
        "title": "今天带小橘去体检",
        "content": "小橘今天很乖...",
        "type": "dynamic",
        "location": "北京",
        "likeCount": 10,
        "commentCount": 5,
        "favoriteCount": 3,
        "viewCount": 100,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "id": "user123",
          "nickname": "猫咪爱好者",
          "avatar": "https://..."
        },
        "images": [
          { "url": "https://...", "type": "image" }
        ],
        "tags": ["日常", "体检"]
      }
    ],
    "total": 200,
    "page": 1,
    "pageSize": 10
  }
}
```

### 5.2 帖子详情

```
GET /api/posts/:id
```

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "post123",
    "userId": "user123",
    "title": "今天带小橘去体检",
    "content": "小橘今天很乖...",
    "type": "dynamic",
    "location": "北京",
    "likeCount": 11,
    "commentCount": 5,
    "favoriteCount": 3,
    "viewCount": 101,
    "status": "published",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "user123",
      "nickname": "猫咪爱好者",
      "avatar": "https://..."
    },
    "images": [
      { "url": "https://...", "type": "image" }
    ],
    "tags": ["日常", "体检"]
  }
}
```

### 5.3 发布帖子

```
POST /api/posts
Authorization: Bearer <token>
```

**请求体:**

```json
{
  "title": "今天带小橘去体检",
  "content": "小橘今天很乖...",
  "type": "dynamic",
  "location": "北京",
  "images": [
    { "url": "https://...", "type": "image" }
  ],
  "tags": ["日常", "体检"]
}
```

**响应:**

```json
{
  "code": 0,
  "message": "发布成功",
  "data": {
    "id": "post123"
  }
}
```

### 5.4 编辑帖子

```
PUT /api/posts/:id
Authorization: Bearer <token>
```

**请求体:** (同发布，所有字段可选)

### 5.5 删除帖子

```
DELETE /api/posts/:id
Authorization: Bearer <token>
```

### 5.6 点赞/取消点赞

```
POST /api/posts/:id/like
Authorization: Bearer <token>
```

**响应:**

```json
{
  "code": 0,
  "message": "已点赞",
  "data": {
    "liked": true
  }
}
```

### 5.7 获取评论

```
GET /api/posts/:id/comments?page=1&pageSize=20
```

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "comment123",
        "content": "好可爱!",
        "likeCount": 5,
        "parentId": null,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "id": "user456",
          "nickname": "路人甲",
          "avatar": "https://..."
        }
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 20
  }
}
```

---

## 6. 评论模块 `/api/comments`

### 6.1 发表评论

```
POST /api/comments
Authorization: Bearer <token>
```

**请求体:**

```json
{
  "postId": "post123",
  "parentId": null,
  "content": "好可爱!"
}
```

**响应:**

```json
{
  "code": 0,
  "message": "评论成功",
  "data": {
    "id": "comment123"
  }
}
```

### 6.2 删除评论

```
DELETE /api/comments/:id
Authorization: Bearer <token>
```

### 6.3 点赞评论

```
POST /api/comments/:id/like
Authorization: Bearer <token>
```

**响应:**

```json
{
  "code": 0,
  "message": "已点赞",
  "data": {
    "liked": true
  }
}
```

---

## 7. 收藏模块 `/api/favorites`

### 7.1 我的收藏列表

```
GET /api/favorites?page=1&pageSize=10&type=pet
Authorization: Bearer <token>
```

**查询参数:**

| 参数     | 类型   | 必填 | 说明           |
| -------- | ------ | ---- | -------------- |
| page     | number | 否   | 页码           |
| pageSize | number | 否   | 每页数量       |
| type     | string | 否   | 类型: pet/post |

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "favoriteId": "fav123",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "pet": {
          "id": "pet123",
          "name": "小橘",
          "species": "cat",
          "city": "北京",
          "status": "available",
          "image": "https://..."
        }
      }
    ],
    "total": 20,
    "page": 1,
    "pageSize": 10
  }
}
```

### 7.2 添加收藏

```
POST /api/favorites
Authorization: Bearer <token>
```

**请求体:**

```json
{
  "targetType": "pet",
  "targetId": "pet123"
}
```

**响应:**

```json
{
  "code": 0,
  "message": "收藏成功",
  "data": {
    "id": "fav123"
  }
}
```

### 7.3 取消收藏

```
DELETE /api/favorites/:id
Authorization: Bearer <token>
```

---

## 8. 消息模块 `/api/messages`

### 8.1 消息列表

```
GET /api/messages?page=1&pageSize=20&type=system&isRead=false
Authorization: Bearer <token>
```

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "msg123",
        "type": "system",
        "title": "系统通知",
        "content": "您的申请已通过",
        "data": null,
        "isRead": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "sender": {
          "id": "system",
          "nickname": "系统",
          "avatar": null
        }
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 20
  }
}
```

### 8.2 未读消息数

```
GET /api/messages/unread-count
Authorization: Bearer <token>
```

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "count": 5
  }
}
```

### 8.3 标记已读

```
PUT /api/messages/:id/read
Authorization: Bearer <token>
```

### 8.4 全部已读

```
PUT /api/messages/read-all
Authorization: Bearer <token>
```

---

## 9. Banner 模块 `/api/banners`

### 9.1 获取 Banner 列表

```
GET /api/banners
```

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "banner123",
      "title": "新年领养活动",
      "image": "https://cdn.example.com/banner1.jpg",
      "link": "/pages/activity/newyear",
      "linkType": "page"
    }
  ]
}
```

---

## 10. 文件上传 `/api/upload`

### 10.1 上传图片

```
POST /api/upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**表单字段:**

- `file`: File (图片文件，最大 10MB，支持 jpg/png/gif/webp)

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "url": "https://cdn.example.com/uploads/abc.jpg",
    "key": "uploads/abc.jpg"
  }
}
```

### 10.2 获取上传凭证

```
GET /api/upload/token?prefix=avatars
Authorization: Bearer <token>
```

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "upload_token_here",
    "key": "avatars/abc123"
  }
}
```

---

## 11. 后台管理 `/api/admin`

> 所有后台接口需要 admin 角色

### 11.1 宠物列表

```
GET /api/admin/pets?page=1&pageSize=20&status=pending
Authorization: Bearer <admin_token>
```

### 11.2 审核宠物

```
PUT /api/admin/pets/:id/review
Authorization: Bearer <admin_token>
```

**请求体:**

```json
{
  "status": "available",
  "note": "审核通过"
}
```

### 11.3 下架宠物

```
PUT /api/admin/pets/:id/offline
Authorization: Bearer <admin_token>
```

### 11.4 用户列表

```
GET /api/admin/users?page=1&pageSize=20
Authorization: Bearer <admin_token>
```

### 11.5 封禁/解封用户

```
PUT /api/admin/users/:id/ban
Authorization: Bearer <admin_token>
```

### 11.6 帖子列表

```
GET /api/admin/posts?page=1&pageSize=20
Authorization: Bearer <admin_token>
```

### 11.7 删除帖子

```
DELETE /api/admin/posts/:id
Authorization: Bearer <admin_token>
```

### 11.8 举报列表

```
GET /api/admin/reports?page=1&pageSize=20&status=pending
Authorization: Bearer <admin_token>
```

### 11.9 处理举报

```
PUT /api/admin/reports/:id/handle
Authorization: Bearer <admin_token>
```

**请求体:**

```json
{
  "status": "resolved",
  "handleNote": "已处理"
}
```

### 11.10 创建 Banner

```
POST /api/admin/banners
Authorization: Bearer <admin_token>
```

**请求体:**

```json
{
  "title": "新年领养活动",
  "image": "https://cdn.example.com/banner1.jpg",
  "link": "/pages/activity/newyear",
  "linkType": "page",
  "sort": 0,
  "startTime": "2024-01-01T00:00:00.000Z",
  "endTime": "2024-02-01T00:00:00.000Z"
}
```

### 11.11 更新 Banner

```
PUT /api/admin/banners/:id
Authorization: Bearer <admin_token>
```

### 11.12 删除 Banner

```
DELETE /api/admin/banners/:id
Authorization: Bearer <admin_token>
```

---

## 12. WebSocket 接口

### 连接

```
ws://localhost:5677/ws
```

### 事件列表

#### 客户端 → 服务端

**认证:**

```json
{
  "type": "auth",
  "payload": {
    "token": "access_token"
  }
}
```

**发送消息:**

```json
{
  "type": "message:send",
  "payload": {
    "receiverId": "user456",
    "content": "你好",
    "messageType": "text"
  }
}
```

**标记已读:**

```json
{
  "type": "message:read",
  "payload": {
    "messageId": "msg123"
  }
}
```

**输入中:**

```json
{
  "type": "typing",
  "payload": {
    "receiverId": "user456",
    "roomId": "room123"
  }
}
```

#### 服务端 → 客户端

**认证成功:**

```json
{
  "type": "auth:success"
}
```

**认证失败:**

```json
{
  "type": "auth:error",
  "payload": {
    "message": "Token 无效"
  }
}
```

**消息已发送:**

```json
{
  "type": "message:sent",
  "payload": {
    "id": "msg123",
    "roomId": "room123",
    "senderId": "user123",
    "receiverId": "user456",
    "type": "text",
    "content": "你好",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**接收消息:**

```json
{
  "type": "message:receive",
  "payload": {
    "id": "msg123",
    "roomId": "room123",
    "senderId": "user123",
    "receiverId": "user456",
    "type": "text",
    "content": "你好",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**已读确认:**

```json
{
  "type": "message:read:ack",
  "payload": {
    "messageId": "msg123"
  }
}
```

**输入中通知:**

```json
{
  "type": "typing:notify",
  "payload": {
    "roomId": "room123",
    "userId": "user123"
  }
}
```
