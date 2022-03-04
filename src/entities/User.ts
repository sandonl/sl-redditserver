import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Float, ObjectType } from "type-graphql";

// Entity class for a User ('think of as a table')
@ObjectType()
@Entity()
export class User {
    @Field(() => Float)
    @PrimaryKey() 
    id!: number;

    // Good practice to keep createdAt and updatedAt fields
    @Field(() => String)
    @Property({type: 'date'})
    createdAt = new Date();

    @Field(() => String)
    @Property({type: 'date', onUpdate: () => new Date() })
    updatedAt = new Date();

    @Field()
    @Property({type: 'text', unique: true})
    username!: string;    

    @Property({type: 'text'})
    password!: string;    

}