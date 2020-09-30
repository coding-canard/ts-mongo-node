import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity, Column,
  CreateDateColumn, Entity,
  ObjectIdColumn, OneToMany, PrimaryColumn, UpdateDateColumn
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
@Entity()
export class Publisher extends BaseEntity {
  @ObjectIdColumn()
  _id!: string;

  @Field(() => String)
  @PrimaryColumn("string")
  id!: string;

  @Field(() => String)
  @Column("string")
  name!: string;

  @Field(() => Int)
  @Column({type: "int"})
  followers: number = 0;

  @Field(() => [Post]!)
  @OneToMany(() => Post, (post) => post.publisher)
  posts: Post[];

  @Column("string")
  createdBy!: string;

  @Column("string")
  updatedBy!: string;

  @Field(() => User)
  creator!: User;

  @Field(() => User)
  updator!: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}