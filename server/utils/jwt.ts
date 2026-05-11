import process from 'node:process'
import * as jwtLib from 'jsonwebtoken'

const PRIVATE_KEY = process.env.JWT_SECRET || '123456'
export type JwtPayload = {
  userId: string
  role: string
  type?: 'refresh'
}
export const jwt = {
  sign<T extends JwtPayload>(data: T, expiresIn: string = '1d') {
    return jwtLib.sign(data, PRIVATE_KEY, {
      algorithm: 'HS256',
      expiresIn: expiresIn as any,
    })
  },
  verify<T extends JwtPayload>(token: string) {
    return new Promise<T>((resolve, reject) => {
      jwtLib.verify(token, PRIVATE_KEY, {
        algorithms: ['HS256'],
      }, (err, decoded) => {
        if (err) {
          return reject(err)
        }
        return resolve(decoded as T)
      })
    })
  },
  decode<T extends JwtPayload>(token: string) {
    return jwtLib.decode(token) as T
  },
}
