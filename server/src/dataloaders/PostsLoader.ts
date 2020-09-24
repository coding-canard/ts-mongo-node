import DataLoader from "dataloader";
import { Post } from "../entities/Post";

export const PostsLoader = new DataLoader<number, Post>(async (userIds) => {
  console.log("Resolver with dataloader called");
  const posts = await Post.find({where: {'authorId': {$in: userIds}}});
  const groupedPosts = posts.reduce((arr, post) => {
    arr[post.authorId] = arr[post.authorId] || [];
    arr[post.authorId].push(post);
    return arr;
  }, Object.create(null));
  const sortedPosts = userIds.map((userId) => typeof groupedPosts[userId] !== 'undefined' ? groupedPosts[userId] : []);
  console.log("GroupedPosts:", sortedPosts);
  console.log("Typeof GroupedPosts:", typeof sortedPosts);
  return sortedPosts;
});

