import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Float, ObjectType } from "type-graphql";

// Entity class for a Post 
@ObjectType()
@Entity()
export class Post {
    @Field(() => Float)
    @PrimaryKey() 
    id!: number;

    @Field(() => String)
    @Property({type: 'date'})
    createdAt = new Date();

    @Field(() => String)
    @Property({type: 'date', onUpdate: () => new Date() })
    updatedAt = new Date();

    @Field()
    @Property({type: 'text'})
    title!: string;    

}