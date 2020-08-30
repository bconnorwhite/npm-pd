import ora from "ora";
import Table from "cli-table3";
import { getSearch, SearchResult, SearchQuery } from "npms-io-client";

type Claim = "author" | "maintainer";

export type PublisherOptions = {
  sort?: SortBy;
  reverse?: boolean;
  org?: string;
  limit?: number;
}

type SortBy = "name" | "version" | "date" | "quality" | "popularity" | "maintenance" | "score";

const sorters: {
  [sort in SortBy]: (a: SearchResult, b: SearchResult) => number;
} = {
  name: (a, b) => b.package.name.localeCompare(a.package.name),
  version: (a, b) => b.package.version.localeCompare(a.package.version),
  date: (a, b) => new Date(a.package.date).getTime() - new Date(b.package.date).getTime(),
  quality: (a, b) => a.score.detail.quality - b.score.detail.quality,
  popularity: (a, b) => a.score.detail.popularity - b.score.detail.popularity,
  maintenance: (a, b) => a.score.detail.maintenance - b.score.detail.maintenance,
  score: (a, b) => a.score.final - b.score.final
};

function getScope(org?: string) {
  if(org?.startsWith("@")) {
    return org.slice(1);
  } else {
    return org;
  }
}

const pageSize = 250;

function nextPage(query: SearchQuery, options: PublisherOptions, pageNum: number = 0) {
  return new Promise((resolve: (value: SearchResult[]) => void) => {
    getSearch(query, pageNum * pageSize, pageSize).then(({ results }) => {
      if(results.length < pageSize) {
        resolve(results);
      } else {
        nextPage(query, options, pageNum + 1).then((next) => {
          resolve(results.concat(next));
        });
      }
    })
  });
}

function sort(packages: SearchResult[], options: PublisherOptions) {
  const sorted = packages.sort(sorters[options.sort ?? "date"]);
  if(options.reverse) {
    return sorted;
  } else {
    return sorted.reverse();
  }
}

function filter(packages: SearchResult[], options: PublisherOptions) {
  if(options.org) {
    return packages.filter((result) => result.package.scope === getScope(options.org));
  } else {
    return packages;
  }
}

function limit(packages: SearchResult[], options: PublisherOptions) {
  if(options.limit) {
    return packages.slice(0,options.limit);
  } else {
    return packages;
  }
}

async function getPublisher(name: string, claim: Claim, options: PublisherOptions) {
  return nextPage({ [claim]: name }, options).then((results) => {
    return limit(sort(filter(results, options), options), options);
  });
}

function setDefaults(options: PublisherOptions) {
  return {
    deprecated: false,
    ...options,
  }
}

export async function formatPublisher(name: string, claim: Claim, options: PublisherOptions) {
  const spinner = ora("Fetching packages...").start();
  getPublisher(name, claim, setDefaults(options)).then((rows) => {
    const table = new Table({
      head: ["Last Update", "Name", "Version", "Quality", "Popularity", "Maintenance", "Score"]
    });
    table.push(...rows.map((row) => [
      new Date(row.package.date).toLocaleDateString(),
      row.package.name,
      row.package.version,
      row.score.detail.quality.toFixed(4),
      row.score.detail.popularity.toFixed(4),
      row.score.detail.maintenance.toFixed(4),
      row.score.final.toFixed(4)
    ]));
    spinner.stop();
    console.log(table.toString());
  });
}
