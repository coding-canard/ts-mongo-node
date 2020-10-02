import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity, Column,
  CreateDateColumn, Entity,
  ManyToOne, ObjectIdColumn, PrimaryColumn, UpdateDateColumn
} from "typeorm";
import { Publisher } from "./Publisher";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @ObjectIdColumn()
  _id!: string;

  @Field(() => String)
  @PrimaryColumn("string")
  id!: string;

  @Field(() => String)
  @Column("string")
  title!: string;

  @Field(() => String)
  @Column("string")
  text!: string;

  @Column("string", {nullable: true})
  publisherId: string;

  @Field({nullable: true})
  @ManyToOne(() => Publisher, (publisher) => publisher.posts)
  publisher: Publisher;

  @Field(() => Int)
  @Column({type: "int"})
  claps: number = 0;

  @Column("string")
  authorId!: string;

  @Field({nullable: true})
  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}