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
export class User extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  readonly _id!: ObjectID;

  @Field(() => String)
  @Column({unique: true})
  email!: string;

  @Column()
  password!: string;

  @Field(() => String, {nullable: true})
  @Column({unique: true, nullable: true})
  username!: string | null;

  @Field(() => Int)
  @Column({type: "int"})
  followers: number = 0;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}