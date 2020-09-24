import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity, Column,
  CreateDateColumn, Entity,
  ObjectIdColumn,
  OneToMany, PrimaryColumn, UpdateDateColumn
} from "typeorm";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @ObjectIdColumn()
  _id!: string

  @Field(() => String)
  @PrimaryColumn("string")
  id!: string;

  @Field(() => String)
  @Column("string", {unique: true})
  email!: string;

  @Column("string")
  password!: string;

  @Field(() => String)
  @Column("string", {unique: true})
  username!: string;

  @Field(() => Int)
  @Column({type: "int"})
  followers: number = 0;

  @Field(() => [Post]!)
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}