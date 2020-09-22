import DataLoader from "dataloader";
import { User } from "./../entities/User";

export const UserLoader = () => new DataLoader<number, User>(async (userIds) => {
  const users = await User.findByIds(userIds as any[]);
  const userIdToUser: Record<string, User> = {};
  users.forEach((u) => {
    userIdToUser[u._id as any] = u;
  });

  const sortedUsers = userIds.map((userId) => userIdToUser[userId]);
  return sortedUsers;
});

