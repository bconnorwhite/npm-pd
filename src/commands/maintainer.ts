import commander from "commander";
import { formatPublisher, PublisherOptions } from "../publisher";

export function maintainer(name: string, options: PublisherOptions) {
  return formatPublisher(name, "maintainer", options);
}

export default (program: commander.Command) => {
  program
    .command("maintainer <name>")
    .description("fetch packages by maintainer")
    .option("-s --sort <value>", "sort by 'date', 'name', 'version', 'quality', 'popularity', 'maintenance', or 'score'")
    .option("-r --reverse", "reverse sort order")
    .option("-o --org <value", "filter packages by org")
    .option("-l --limit <number>", "limit the number of packages returned")
    .action(maintainer);
}
