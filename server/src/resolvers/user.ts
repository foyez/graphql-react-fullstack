import {
  Resolver,
  Mutation,
  Field,
  Arg,
  ObjectType,
  Ctx,
  Query,
} from 'type-graphql'
import argon2 from 'argon2'

import { User } from '../entity/User'
import { RegisterInput } from '../utils/RegisterInput'
import { validateRegister } from '../utils/validateRegister'
import { MyContext } from '../types'
import { errorHandlers } from '../utils/errorHandlers'

@ObjectType()
export class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg('credentials') credentials: RegisterInput,
    @Ctx() { req }: MyContext,
  ): Promise<UserResponse> {
    const errors = validateRegister(credentials)
    if (errors) {
      return { errors }
    }

    const { username, password, email } = credentials
    const hashedPassword = await argon2.hash(password)
    const user = User.create({
      username,
      email,
      password: hashedPassword,
    })

    try {
      await user.save()
    } catch (err) {
      return errorHandlers(err)
    }

    // store user session
    req.session.userId = user.id

    return { user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext,
  ): Promise<UserResponse> {
    const user = await User.findOne({ username })
    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: "username doesn't exist",
          },
        ],
      }
    }
    const validPassword = await argon2.verify(user.password, password)
    if (!validPassword) {
      return {
        errors: [
          {
            field: 'password',
            message: 'incorrect password',
          },
        ],
      }
    }

    // store user session
    req.session.userId = user.id

    return { user }
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    // console.log(req.session)
    const { userId } = req.session

    // not logged in
    if (!userId) {
      return null
    }

    const user = await User.findOne({ id: userId })
    return user
  }
}
