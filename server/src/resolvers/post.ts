import {
  Resolver,
  Query,
  Arg,
  Mutation,
  InputType,
  Field,
  Ctx,
  UseMiddleware,
  Int,
} from 'type-graphql'

import { Post } from '../entity/Post'
import { getConnection } from 'typeorm'
import { MyContext } from '../types'
import { isAuth } from '../middleware/isAuth'

@InputType()
class PostInput {
  @Field()
  title: string

  @Field()
  text: string
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
  ): Promise<Post[]> {
    const realLimit = Math.min(20, limit)

    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder('p')
      .orderBy('"createdAt"', 'DESC')
      .take(realLimit)

    if (cursor) {
      qb.where('"createdAt" < :cursor', { cursor })
    }

    return qb.getMany()
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id', () => String) id: string): Promise<Post | undefined> {
    return Post.findOne(id)
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  createPost(
    @Arg('postInput') postInput: PostInput,
    @Ctx() { req }: MyContext,
  ): Promise<Post> {
    return Post.create({ ...postInput, creatorId: req.session.userId }).save()
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id', () => String) id: string,
    @Arg('title', () => String) title: string,
  ): Promise<Post | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title })
      .where('id = :id', { id })
      .returning('*')
      .execute()

    return result.raw[0]
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg('id', () => String) id: string): Promise<boolean> {
    try {
      await Post.delete({ id })
      return true
    } catch (err) {
      return false
    }
  }
}
