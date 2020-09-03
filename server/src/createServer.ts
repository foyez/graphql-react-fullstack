import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'

import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'

export const createServer = async () => {
  const app = express()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
  })

  apolloServer.applyMiddleware({ app })

  // test express server
  app.get('/', (_, res) => {
    res.send('Hello, World')
  })

  return app
}
