import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm'
import { ObjectType, Field } from 'type-graphql'
import { Post } from './Post'

// export enum Gender {
//   male = 'male',
//   female = 'female',
//   undisclosed = 'undisclosed',
// }

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column({ type: 'varchar', length: 50, unique: true })
  username: string

  @Field()
  @Column({ type: 'varchar', length: 100, unique: true })
  email: string

  @Column()
  password: string

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[]

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date
}
