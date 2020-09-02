import commander from "commander";
import { getPackage, PackageResult } from "npms-io-client";
import ora from "ora";
import chalk from "chalk";
import { carefulness, tests, health, branding } from "./quality";
import { downloadsAcceleration, communityInterest } from "./popularity";
import { releasesFrequency, commitsFrequency, openIssues, isFinished } from "./maintenance";

const width = 48;
const tab = (n: number = 1) => {
  return new Array(n).join("  ");
};

type Chalk = (text: string) => string;

function noColor(text: string) {
  return text;
}

function space(a: string, b: string, lineColor: Chalk = noColor, rightColor: Chalk = (b === "0" ? chalk.red : noColor)) {
  const spaces = new Array(width - 1 - (a.length + b.length)).join(" ");
  console.log(lineColor(a + ":" + spaces + rightColor(b)));
}

function decimal(a: string, b: number, lineColor: ((text: string) => string) = (text) => text) {
  let num = b >= 10 ? b.toFixed(0) : b.toFixed(4);
  if(num === "1.0000") {
    return space(a, num, lineColor, chalk.green);
  } else if(num === "0.0000") {
    return space(a, num, lineColor, chalk.red);
  } else {
    return space(a, num, lineColor);
  }
}

function category(a: string, b: number) {
  return decimal(`${tab()}${a}`, b);
}

function subcategory(a: string, b: number, integer?: boolean) {
  if(integer) {
    return space(`${tab(2)}${a}`, b.toString());
  } else {
    return decimal(`${tab(2)}${a}`, b);
  }
}

function item(a: string, b: number, integer?: boolean) {
  if(integer) {
    return space(`${tab(2)}- ${a}`, b.toString(), chalk.dim);
  } else {
    return decimal(`${tab(2)}- ${a}`, b, chalk.dim);
  }
}

function line(color: ((text: string) => string) = chalk.white) {
  console.log(color(new Array(width).join("-")));
}

function header(result: PackageResult) {
  line();
  space("Name", result.collected.metadata.name);
  space("Version", result.collected.metadata.version, chalk.gray);
  space("Last Package Update", new Date(result.collected.metadata.date).toLocaleString(), chalk.gray);
  space("Last Analysis", new Date(result.analyzedAt).toLocaleString(), chalk.gray);
  line();
}

function printCarefulness(result: PackageResult) {
  const {
    licenseEvaluation,
    readmeEvaluation,
    lintersEvaluation,
    ignoreEvaluation,
    changelogEvaluation,
    isDeprecated,
    isStable
  } = carefulness(result.collected);
  subcategory("Carefulness", result.evaluation.quality.carefulness);
  item("License", licenseEvaluation);
  item("README", readmeEvaluation);
  item("Linters", lintersEvaluation);
  item("Ignore", ignoreEvaluation);
  item("Changelog", changelogEvaluation);
  item("Not Deprecated", isDeprecated);
  item("Is Stable", isStable);
}

function printTests(result: PackageResult) {
  const {
    testsEvaluation,
    statusEvaluation,
    coverageEvaluation
  } = tests(result.collected);
  subcategory("Tests", result.evaluation.quality.tests);
  item("Tests", testsEvaluation);
  item("GitHub Status", statusEvaluation);
  item("Coverage Evaluation", coverageEvaluation);
}

function printHealth(result: PackageResult) {
  const {
    outdatedEvaluation,
    vulnerabilitiesEvaluation,
    unlockedEvaluation
  } = health(result.collected);
  subcategory("Health", result.evaluation.quality.health);
  item("Outdated Dependencies", outdatedEvaluation);
  item("Vulnerabilities", vulnerabilitiesEvaluation);
  item("Unlocked Dependencies", unlockedEvaluation);
}

function printBranding(result: PackageResult) {
  const {
    homepageEvaluation,
    badgesEvaluation
  } = branding(result.collected);
  subcategory("Branding", result.evaluation.quality.branding);
  item("Badges", badgesEvaluation);
  item("Homepage", homepageEvaluation);
}

function quality(result: PackageResult) {
  category("Quality", result.score.detail.quality);
  printCarefulness(result);
  printTests(result);
  printHealth(result);
  printBranding(result);
}

function printCommunityInterest(result: PackageResult) {
  const {
    starsCount,
    forksCount,
    subscribersCount,
    contributorsCount
  } = communityInterest(result.collected);
  subcategory("Community Interest", result.evaluation.popularity.communityInterest, true);
  item("GitHub Stars", starsCount, true);
  item("GitHub Forks", forksCount, true);
  item("GitHub Subscribers", subscribersCount, true);
  item("GitHub Contributors", contributorsCount, true);
}

function printDownloadsAcceleration(result: PackageResult) {
  const {
    shortTermAcceleration,
    midTermAcceleration,
    longTermAcceleration
  } = downloadsAcceleration(result.collected);
  subcategory("Downloads Count", result.evaluation.popularity.downloadsCount, true);
  subcategory("Downloads Acceleration", result.evaluation.popularity.downloadsAcceleration);
  item("Short Term Acceleration", shortTermAcceleration);
  item("Mid Term Acceleration", midTermAcceleration);
  item("Long Term Acceleration", longTermAcceleration);
}

function popularity(result: PackageResult) {
  category("Popularity", result.score.detail.popularity);
  printCommunityInterest(result);
  printDownloadsAcceleration(result);
  subcategory("Dependents Count", result.evaluation.popularity.dependentsCount, true);
}

function printReleasesFrequency(result: PackageResult) {
  const {
    lastMonthReleases,
    lastQuarterReleases,
    lastYearReleases,
    lastTwoYearsReleases
  } = releasesFrequency(result.collected);
  subcategory("Releases Frequency", result.evaluation.maintenance.releasesFrequency);
  item("Last Month", lastMonthReleases);
  item("Last Quarter", lastQuarterReleases);
  item("Last Year", lastYearReleases);
  item("Last Two Years", lastTwoYearsReleases);
}

function printCommitFrequency(result: PackageResult) {
  const {
    lastMonthCommits,
    lastQuarterCommits,
    lastYearCommits
  } = commitsFrequency(result.collected);
  subcategory("Commits Frequency", result.evaluation.maintenance.commitsFrequency);
  item("Last Month", lastMonthCommits);
  item("Last Quarter", lastQuarterCommits);
  item("Last Year", lastYearCommits);
}

function printOpenIssues(result: PackageResult) {
  const {
    totalIssues
  } = openIssues(result.collected);
  subcategory("Open Issues", result.evaluation.maintenance.openIssues);
  item("Total Issues", totalIssues, true);
}

function printIsFinished(result: PackageResult) {
  const {
    isStable,
    isNotDeprecated,
    hasFewIssues,
    hasREADME,
    hasTests,
    finished
  } = isFinished(result.collected);
  subcategory("Is Finished", finished);
  item("Is Stable", isStable);
  item("Not Deprecated", isNotDeprecated);
  item("< 15 Open Issues", hasFewIssues);
  item("Has README", hasREADME);
  item("Has Tests", hasTests);
}

function maintenance(result: PackageResult) {
  category("Maintenance", result.score.detail.maintenance);
  printReleasesFrequency(result);
  printCommitFrequency(result);
  printOpenIssues(result);
  subcategory("Issues Distribution", result.evaluation.maintenance.issuesDistribution);
  printIsFinished(result);
}

export function evaluate(name: string) {
  const spinner = ora("Fetching package...").start();
  getPackage(name).then((result) => {
    spinner.stop();
    header(result);
    decimal("Score", result.score.final);
    quality(result);
    popularity(result);
    maintenance(result);
    line();
  });
}

export default (program: commander.Command) => {
  program
    .command("evaluate <name>")
    .description("show analysis for a package")
    .action(evaluate);
}
