import DataLoader from "dataloader";
import { Publisher } from "./../entities/Publisher";

export const PublishersLoader = new DataLoader<number, Publisher>(async (publisherIds) => {
  publisherIds = publisherIds.filter( id => { return typeof id !== 'undefined'});
  const publishers = await Publisher.find({where: {'id': {$in: publisherIds}}});
  const publisherIdToPublisher: Record<string, Publisher> = {};
  publishers.forEach((p) => {
    publisherIdToPublisher[p.id as any] = p;
  });

  const sortedPublishers = publisherIds.map((publisherId) => publisherIdToPublisher[publisherId]);
  // console.log("SortedUsers:", sortedUsers);
  // console.log("Typeof SortedUsers:", typeof sortedUsers);
  return sortedPublishers;
});

