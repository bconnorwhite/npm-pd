import commander from "commander";
import { formatPublisher, PublisherOptions } from "../publisher";

export function author(name: string, options: PublisherOptions) {
  return formatPublisher(name, "author", options);
}

export default (program: commander.Command) => {
  program
    .command("author <name>")
    .description("fetch packages by author")
    .option("-s --sort <value>", "sort by 'date', 'name', 'version', 'quality', 'popularity', 'maintenance', or 'score'")
    .option("-r --reverse", "reverse sort order")
    .option("-o --org <value", "filter packages by org")
    .option("-l --limit <number>", "limit the number of packages returned")
    .action(author);
}

