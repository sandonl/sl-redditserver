import { Post } from "../entities/Post";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "src/types";

@Resolver()
export class PostResolver {
    // Finds all posts
    // Sets GraphQL Type
    @Query(() => [Post])
    posts(
        @Ctx() {em}: MyContext
        // Sets TypeScript Type
    ): Promise<Post[]> 
     {
        return em.find(Post, {});
    }

    // Finds a single post
    @Query(() => Post, {nullable: true})
    post(
        // Changes the name in the schema
        @Arg('id', () => Int) id: number,
        @Ctx() {em}: MyContext
    ): Promise<Post | null> 
     {
        //  Uses the orm to return a post
        return em.findOne(Post, { id });
    }

    // Creates a post
    @Mutation(() => Post)
    async createPost(
        @Arg('title', () => String) title: string,
        @Ctx() {em}: MyContext
    ): Promise<Post> 
     {
        const post = em.create(Post, {title})
        await em.persistAndFlush(post)
        return post;
    }

    // Updates a post 
    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg('id',) id: number,
        @Arg('title', () => String, { nullable: true }) title: string,
        @Ctx() {em}: MyContext
    ): Promise<Post | null> 
     {  
        //  First finds the post 
         const post = await em.findOne(Post, {id});
         if (!post) { 
            return null
         }
        //  If the post is not undefined, rewrite it according to the title and write with orm
         if (typeof title !== "undefined") {
             post.title = title;
             await em.persistAndFlush(post)
         }
        return post;
    }

    // Deletes a post
    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id',) id: number,
        @Ctx() {em}: MyContext
    ): Promise<boolean> 
     {  
        await em.nativeDelete(Post, {id});
        return true
    }
}