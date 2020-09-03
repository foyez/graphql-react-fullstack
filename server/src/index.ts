import 'reflect-metadata'
import path from 'path'
import { createConnection } from 'typeorm'

import { __prod__ } from './constants'
import { User } from './entity/User'
import { createServer } from './createServer'
import { Post } from './entity/Post'

const main = async () => {
  await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'foyez',
    password: 'testpass',
    database: 'graphql-full-stack',
    // synchronize: !__prod__,
    logging: true,
    migrations: [path.join(__dirname, './migration/*')],
    entities: [User, Post],
  })
  // await conn.runMigrations()

  // await User.create({ username: 'foyez' }).save()
  // await Post.create({ title: 'Test post' }).save()
  // const users = await User.find()
  // console.log(users)

  const server = await createServer()

  server.listen(4000, () => {
    console.log('Server started on localhost:4000')
  })
}

main().catch((err) => console.log(err))
