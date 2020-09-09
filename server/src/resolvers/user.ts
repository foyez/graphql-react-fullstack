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
import { v4 } from 'uuid'

import { User } from '../entity/User'
import { RegisterInput } from '../utils/RegisterInput'
import { validateRegister } from '../utils/validateRegister'
import { MyContext } from '../types'
import { errorHandlers } from '../utils/errorHandlers'
import {
  COOKIE_NAME,
  FORGOT_PASSWORD_PREFIX,
  CLIENT_BASE_URI,
} from '../constants'
import { sendEmail } from '../utils/sendEmail'

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
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext,
  ): Promise<UserResponse> {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

    const user = await User.findOne(
      pattern.test(usernameOrEmail.trim())
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail },
    )
    if (!user) {
      return {
        errors: [
          {
            field: 'usernameOrEmail',
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
  async me(@Ctx() { req }: MyContext): Promise<User | null | undefined> {
    // console.log(req.session)
    const { userId } = req.session

    // not logged in
    if (!userId) {
      return null
    }

    const user = await User.findOne({ id: userId })
    return user
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME)

        if (err) {
          resolve(false)
          return
        }

        resolve(true)
      }),
    )
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: MyContext,
  ): Promise<boolean> {
    const user = await User.findOne({ email })
    if (!user) {
      return true
    }

    const token = v4()
    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      'ex',
      1000 * 60 * 60 * 24 * 3, // 3 days
    )

    await sendEmail(
      email,
      `<a href="${CLIENT_BASE_URI}/change-password/${token}">reset password</a>`,
    )

    return true
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { req, redis }: MyContext,
  ): Promise<UserResponse> {
    if (newPassword.length < 6) {
      return {
        errors: [
          {
            field: 'newPassword',
            message: 'length must be greater than 5',
          },
        ],
      }
    }

    const key = FORGOT_PASSWORD_PREFIX + token
    const userId = await redis.get(key)
    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'token expired',
          },
        ],
      }
    }

    const user = await User.findOne(userId)
    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'user no longer exists',
          },
        ],
      }
    }

    await User.update(
      { id: userId },
      { password: await argon2.hash(newPassword) },
    )

    await redis.del(key)

    // login user after changing password
    req.session.userId = user.id

    return { user }
  }
}
