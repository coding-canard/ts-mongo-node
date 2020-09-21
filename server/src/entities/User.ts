import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  Entity,
  ObjectID,
  Column,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity, OneToMany
} from "typeorm";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  readonly _id!: ObjectID;

  @Field(() => String)
  @Column({unique: true})
  email!: string;

  @Column()
  password!: string;

  @Field(() => String)
  @Column({unique: true})
  username!: string;

  @Field(() => Int)
  @Column({type: "int"})
  followers: number = 0;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}