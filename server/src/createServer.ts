import express, { Request, Response } from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import cors from 'cors'
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'

import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'
import { __prod__ } from './constants'
import { MyContext } from './types'

export const createServer = async () => {
  const app = express()

  // SETUP REDIS SESSION STORAGE
  const RedisStore = connectRedis(session)
  const redisClient = new Redis()

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  )

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: 'keyboard cat',
      resave: false,
    }),
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({
      req,
      res,
    }: {
      req: Request & { session: Express.Session }
      res: Response
    }): MyContext => ({ req, res }),
  })

  apolloServer.applyMiddleware({ app, cors: false })

  // test express server
  app.get('/', (_, res) => {
    res.send('Hello, World')
  })

  return app
}
