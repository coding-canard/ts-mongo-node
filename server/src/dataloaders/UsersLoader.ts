import DataLoader from "dataloader";
import { User } from "../entities/User";

export const UsersLoader = new DataLoader<number, User>(async (userIds) => {
  const users = await User.find({where: {'id': {$in: userIds}}});
  const userIdToUser: Record<string, User> = {};
  users.forEach((u) => {
    userIdToUser[u.id as any] = u;
  });

  const sortedUsers = userIds.map((userId) => userIdToUser[userId]);
  // console.log("SortedUsers:", sortedUsers);
  // console.log("Typeof SortedUsers:", typeof sortedUsers);
  return sortedUsers;
});

