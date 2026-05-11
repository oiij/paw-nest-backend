import { and, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { defineWebSocketHandler } from 'nitro'
import { db } from '~/db'
import { chatMessages, chatRooms } from '~/db/schema'
import { jwt } from '~/utils/jwt'
import { cacheDel, CacheKeys, cacheSet } from '~/utils/redis'

const peerMap = new Map<string, any>()

export default defineWebSocketHandler({
  open(peer) {
    const id = peer.id
    peerMap.set(id, peer)
  },
  async message(peer: any, message) {
    try {
      const msg = JSON.parse(typeof message === 'string' ? message : message.toString())
      const { type, payload } = msg

      if (type === 'auth') {
        try {
          const decoded = await jwt.verify(payload.token)
          peer._userId = decoded.userId
          peer._role = decoded.role
          await cacheSet(CacheKeys.online(decoded.userId), peer.id, 300)
          peer.send(JSON.stringify({ type: 'auth:success' }))
        }
        catch {
          peer.send(JSON.stringify({ type: 'auth:error', payload: { message: 'Token 无效' } }))
        }
        return
      }

      if (!peer._userId) {
        peer.send(JSON.stringify({ type: 'error', payload: { message: '请先登录' } }))
        return
      }

      if (type === 'message:send') {
        const { receiverId, content, messageType = 'text' } = payload
        const senderId = peer._userId

        const [user1, user2] = senderId < receiverId
          ? [senderId, receiverId]
          : [receiverId, senderId]

        let room = await db.select().from(chatRooms).where(and(eq(chatRooms.user1Id, user1), eq(chatRooms.user2Id, user2))).then(r => r[0]) as any

        if (!room) {
          const roomId = nanoid(21)
          await db.insert(chatRooms).values({
            id: roomId,
            user1Id: user1,
            user2Id: user2,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          room = { id: roomId, user1Id: user1, user2Id: user2 }
        }

        const messageId = nanoid(21)
        await db.insert(chatMessages).values({
          id: messageId,
          roomId: room.id,
          senderId,
          type: messageType,
          content,
          createdAt: new Date(),
        })

        await db.update(chatRooms)
          .set({ lastMessage: content, lastMessageAt: new Date(), updatedAt: new Date() })
          .where(eq(chatRooms.id, room.id))

        const message = {
          id: messageId,
          roomId: room.id,
          senderId,
          receiverId,
          type: messageType,
          content,
          createdAt: new Date(),
        }

        peer.send(JSON.stringify({ type: 'message:sent', payload: message }))

        const receiverWs = Array.from(peerMap.values()).find(
          (p: any) => p._userId === receiverId,
        ) as any

        if (receiverWs && receiverWs.readyState === 1) {
          receiverWs.send(JSON.stringify({ type: 'message:receive', payload: message }))
        }
      }

      if (type === 'message:read') {
        const { messageId } = payload
        await db.update(chatMessages)
          .set({ isRead: true })
          .where(eq(chatMessages.id, messageId))

        peer.send(JSON.stringify({ type: 'message:read:ack', payload: { messageId } }))
      }

      if (type === 'typing') {
        const { receiverId, roomId } = payload
        const receiverWs = Array.from(peerMap.values()).find(
          (p: any) => p._userId === receiverId,
        ) as any

        if (receiverWs && receiverWs.readyState === 1) {
          receiverWs.send(JSON.stringify({
            type: 'typing:notify',
            payload: { roomId, userId: peer._userId },
          }))
        }
      }
    }
    catch {
      peer.send(JSON.stringify({ type: 'error', payload: { message: '消息格式错误' } }))
    }
  },
  async close(peer: any) {
    const id = peer.id
    peerMap.delete(id)
    if (peer._userId) {
      await cacheDel(CacheKeys.online(peer._userId))
    }
  },
  error(_peer, error) {
    console.error('Error:', error)
  },
})
