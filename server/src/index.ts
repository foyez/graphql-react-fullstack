import 'reflect-metadata'
import path from 'path'
import { createConnection } from 'typeorm'

import { __prod__ } from './constants'
import { User } from './entity/User'
import { createServer } from './createServer'

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
    entities: [User],
  })
  // await conn.runMigrations()

  // await User.create({ username: 'foyez' }).save()
  // const users = await User.find()
  // console.log(users)

  const server = await createServer()

  server.listen(4000, () => {
    console.log('Server started on localhost:4000')
  })
}

main().catch((err) => console.log(err))
