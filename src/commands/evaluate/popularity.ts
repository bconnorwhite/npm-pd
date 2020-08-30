import { PackageCollected } from "npms-io-client";
import { find } from "lodash";
import moment from "moment";

export function communityInterest(collected: PackageCollected) {
  return {
    starsCount: (collected.github ? collected.github.starsCount : 0) + (collected.npm ? collected.npm.starsCount : 0),
    forksCount: collected.github ? collected.github.forksCount : 0,
    subscribersCount: collected.github ? collected.github.subscribersCount : 0,
    contributorsCount: collected.github ? (collected.github.contributors || []).length : 0
  }
}

export function downloadsAcceleration(collected: PackageCollected) {
  const downloads = collected.npm && collected.npm.downloads;
  if(!downloads) {
    return {
      shortTermAcceleration: 0,
      midTermAcceleration: 0,
      longTermAcceleration: 0
    }
  }
  const range30 = find(downloads, (range) => moment.utc(range.to).diff(range.from, 'd') === 30);
  const range90 = find(downloads, (range) => moment.utc(range.to).diff(range.from, 'd') === 90);
  const range180 = find(downloads, (range) => moment.utc(range.to).diff(range.from, 'd') === 180);
  const range365 = find(downloads, (range) => moment.utc(range.to).diff(range.from, 'd') === 365);
  if(!range30 || !range90 || !range180 || !range365) {
    throw new Error('Could not find entry in downloads');
  }
  const mean30 = range30.count / 30;
  const mean90 = range90.count / 90;
  const mean180 = range180.count / 180;
  const mean365 = range365.count / 365;
  return {
    shortTermAcceleration: mean30 - mean90,
    midTermAcceleration: mean90 - mean180,
    longTermAcceleration: mean180 - mean365 
  }
}
