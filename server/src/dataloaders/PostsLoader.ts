import DataLoader from "dataloader";
import { Post } from "../entities/Post";

export const PostsLoaderByAuthor = new DataLoader<number, Post>(async (userIds) => {
  console.log("Resolver with dataloader called");
  const posts = await Post.find({where: {"authorId": {$in: userIds}}});
  const groupedPosts = posts.reduce((arr, post) => {
    arr[post.authorId] = arr[post.authorId] || [];
    arr[post.authorId].push(post);
    return arr;
  }, Object.create(null));
  const sortedPosts = userIds.map((userId) => typeof groupedPosts[userId] !== 'undefined' ? groupedPosts[userId] : []);
  return sortedPosts;
});

export const PostsLoaderByPublisher = new DataLoader<number, Post>(async (publisherIds) => {
  console.log("Resolver with dataloader called");
  const posts = await Post.find({where: {"publisherId": {$in: publisherIds}}});
  const groupedPosts = posts.reduce((arr, post) => {
    arr[post.publisherId] = arr[post.publisherId] || [];
    arr[post.publisherId].push(post);
    return arr;
  }, Object.create(null));
  const sortedPosts = publisherIds.map((publisherId) => typeof groupedPosts[publisherId] !== 'undefined' ? groupedPosts[publisherId] : []);
  return sortedPosts;
});

