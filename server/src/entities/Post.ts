import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  Entity,
  ObjectID,
  Column,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity
} from "typeorm";

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

  @Field(() => String)
  @Column()
  author!: string;

  @Field(() => String, {nullable: true})
  @Column()
  publisher: string | null;

  @Field(() => Int)
  @Column({type: "int"})
  claps: number = 0;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}