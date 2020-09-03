import { Resolver, Query, Arg, Mutation } from 'type-graphql'

import { Post } from '../entity/Post'
import { getConnection } from 'typeorm'

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find()
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id', () => String) id: string): Promise<Post | undefined> {
    return Post.findOne({ id })
  }

  @Mutation(() => Post)
  createPost(@Arg('title', () => String) title: string): Promise<Post> {
    return Post.create({ title }).save()
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
