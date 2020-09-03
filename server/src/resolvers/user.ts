import { Resolver, Mutation, Field, Arg, ObjectType } from 'type-graphql'
import argon2 from 'argon2'

import { User } from '../entity/User'
import { RegisterInput } from '../utils/RegisterInput'
import { validateRegister } from '../utils/validateRegister'

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
      // duplicate username error
      if (err.code === '23505' && err.detail.includes('username')) {
        return {
          errors: [
            {
              field: 'username',
              message: 'username already taken',
            },
          ],
        }
      } else if (err.code === '23505' && err.detail.includes('email')) {
        return {
          errors: [
            {
              field: 'email',
              message: 'email already taken',
            },
          ],
        }
      }
    }

    return { user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string,
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

    return { user }
  }
}
