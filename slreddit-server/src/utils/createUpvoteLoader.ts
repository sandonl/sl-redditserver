import DataLoader from "dataloader";
import { Upvote } from "../entities/Upvote";

// We need to know both the post id and user ids
// [{postId: 5, userId: 10}]
// e.g. we load {postId: 5, userId: 10, value: 1}
// []
export const createUpvoteLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Upvote | null>(
    async (keys) => {
      const upvotes = await Upvote.findByIds(keys as any);
      // can also write custom SQL here
      const upvoteIdsToUpvote: Record<string, Upvote> = {};
      upvotes.forEach((upvote) => {
        upvoteIdsToUpvote[`${upvote.userId}|${upvote.postId}`] = upvote;
      });

      return keys.map(
        (key) => upvoteIdsToUpvote[`${key.userId}|${key.postId}`]
      );
    }
  );
