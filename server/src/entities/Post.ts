import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity, Column,
  CreateDateColumn, Entity,
  ManyToOne, ObjectIdColumn, PrimaryColumn, UpdateDateColumn
} from "typeorm";
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

  @Field(() => String, {nullable: true})
  @Column("string", {nullable: true})
  publisher: string | null;

  @Field(() => Int)
  @Column({type: "int"})
  claps: number = 0;

  @Field(() => String)
  @Column("string")
  authorId!: string;

  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  author!: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}