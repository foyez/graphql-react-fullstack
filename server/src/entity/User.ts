import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm'

// enum Gender {
//   male = 'male',
//   female = 'female',
//   undisclosed = 'undisclosed',
// }

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { length: 50 })
  username: string

  // @Column({
  //   type: 'enum',
  //   enum: Gender,
  //   default: Gender.male,
  // })
  // gender: Gender

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
