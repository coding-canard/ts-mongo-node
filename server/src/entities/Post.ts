import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  Entity,
  ObjectID,
  Column,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity, ManyToOne
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  readonly _id!: ObjectID;

  @Field(() => String)
  @Column()
  title!: string;

  @Field(() => String)
  @Column()
  text!: string;

  @Field(() => String, {nullable: true})
  @Column()
  publisher: string | null;

  @Field(() => Int)
  @Column({type: "int"})
  claps: number = 0;

  @Field(() => ID)
  @ObjectIdColumn()
  authorId!: ObjectID;

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