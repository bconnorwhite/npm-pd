import { find, get } from "lodash";
import semver from "semver";
import moment from "moment";
import { PackageCollected } from "npms-io-client";

export function releasesFrequency(collected: PackageCollected) {
  const releases = collected.metadata.releases;
  if(!releases) {
    return {
      lastMonthReleases: 0,
      lastQuarterReleases: 0,
      lastYearReleases: 0,
      lastTwoYearsReleases: 0
    }
  }
  const range30 = find(releases, (range) => moment.utc(range.to).diff(range.from, 'd') === 30);
  const range180 = find(releases, (range) => moment.utc(range.to).diff(range.from, 'd') === 180);
  const range365 = find(releases, (range) => moment.utc(range.to).diff(range.from, 'd') === 365);
  const range730 = find(releases, (range) => moment.utc(range.to).diff(range.from, 'd') === 730);
  if(!range30 || !range180 || !range365 || !range730) {
    throw new Error('Could not find entry in releases');
  }
  return {
    lastMonthReleases: range30.count / (30 / 90),
    lastQuarterReleases: range180.count / (180 / 90),
    lastYearReleases: range365.count / (365 / 90),
    lastTwoYearsReleases: range730.count / (730 / 90)
  }
}

export function commitsFrequency(collected: PackageCollected) {
  const commits = collected.github && collected.github.commits;
  if(!commits) {
    return {
      lastMonthCommits: 0,
      lastQuarterCommits: 0,
      lastYearCommits: 0
    }
  }
  const range30 = find(commits, (range) => moment.utc(range.to).diff(range.from, 'd') === 30);
  const range180 = find(commits, (range) => moment.utc(range.to).diff(range.from, 'd') === 180);
  const range365 = find(commits, (range) => moment.utc(range.to).diff(range.from, 'd') === 365);
  if(!range30 || !range180 || !range365) {
    throw new Error('Could not find entry in commits');
  }
  return {
    lastMonthCommits: range30.count / (30 / 30),
    lastQuarterCommits: range180.count / (180 / 30),
    lastYearCommits: range365.count / (365 / 30)
  }
}

export function openIssues(collected: PackageCollected) {
  const issues = collected.github && collected.github.issues;
  if(!issues || issues.isDisabled || !issues.count) {
    return {
      totalIssues: 0
    }
  } else {
    return {
      totalIssues: issues.count
    }
  }
}

export function isFinished(collected: PackageCollected) {
  const isStable: boolean = semver.gte(collected.metadata.version, '1.0.0', true);
  const isNotDeprecated = !collected.metadata.deprecated;
  const hasFewIssues = get(collected, 'github.issues.openCount', Infinity) < 15;
  const hasREADME = Boolean(collected.metadata.readme);
  const hasTests = Boolean(collected.metadata.hasTestScript);
  return {
    isStable: Number(isStable),
    isNotDeprecated: Number(isNotDeprecated),
    hasFewIssues: Number(hasFewIssues),
    hasREADME: Number(hasREADME),
    hasTests: Number(hasTests),
    finished: Number(isStable && isNotDeprecated && hasFewIssues && hasREADME && hasTests)
  };
}
