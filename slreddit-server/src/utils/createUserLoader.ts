import DataLoader from "dataloader";
import { In } from "typeorm";
import { User } from "../entities/User";

// [1, 7, 8, 9] (User ids) and return objects that are the users
// [{id: 1, username: bob}, User2, ...]
export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findBy({
      id: In(userIds as number[]),
    });
    const userIdToUser: Record<number, User> = {};
    users.forEach((u) => {
      userIdToUser[u.id] = u;
    });

    return userIds.map((userId) => userIdToUser[userId]);
  });
