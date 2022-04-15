import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";

@Resolver()
export class PostResolver {
  // Finds all posts
  // Sets GraphQL Type
  @Query(() => [Post])
  async posts(): // Sets TypeScript Type
  Promise<Post[]> {
    return Post.find();
  }

  // Finds a single post
  @Query(() => Post, { nullable: true })
  // Changes the name in the schema
  post(@Arg("id") id: number): Promise<Post | null> {
    return Post.findOne({ where: { id } });
  }

  // Creates a post
  @Mutation(() => Post)
  async createPost(@Arg("title", () => String) title: string): Promise<Post> {
    // 2 Sql Queries
    return Post.create({ title }).save();
  }

  // Updates a post
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne({ where: { id } });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      await Post.update({ id }, { title });
    }
    return post;
  }

  // Deletes a post
  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
