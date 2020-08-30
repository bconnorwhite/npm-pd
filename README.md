<div align="center">
  <h1>npm-pd</h1>
  <a href="https://npmjs.com/package/npm-publisher-dashboard">
    <img alt="npm" src="https://img.shields.io/npm/v/npm-publisher-dashboard.svg">
  </a>
  <a href="https://github.com/bconnorwhite/npm-publisher-dashboard">
    <img alt="typescript" src="https://img.shields.io/github/languages/top/bconnorwhite/npm-publisher-dashboard.svg">
  </a>
  <a href="https://github.com/bconnorwhite/npm-publisher-dashboard">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/bconnorwhite/npm-publisher-dashboard?label=Stars%20Appreciated%21&style=social">
  </a>
  <a href="https://twitter.com/bconnorwhite">
    <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/bconnorwhite.svg?label=%40bconnorwhite&style=social">
  </a>
</div>

<br />

> A CLI dashboard for NPM publishers.

## Installation

```bash
yarn global add npm-pd
```

```bash
npm install --global npm-pd
```
## API
- [CLI Usage](#CLI-Usage)
  - [npm-pd maintainer](#Maintainer)
  - [npm-pd author](#Author)
  - [npm-pd evaluate](#Evaluate)
- [Programmatic Usage](#Programmatic-Usage)
- [Commander Plugins](#Commander-Plugins)

##

<br />

### CLI Usage:
#### yarn npm-pd --help
```
Usage: npm-pd [options] [command]

Options:
  -V, --version                output the version number
  -h, --help                   display help for command

Commands:
  maintainer [options] <name>  fetch packages by maintainer
  author [options] <name>      fetch packages by author
  evaluate <name>              show analysis for a package
  help [command]               display help for command
```

##

<br />

### Maintainer:
#### yarn npm-pd maintainer --help
Display packages by maintainer.
```
Usage: npm-pd maintainer [options] <name>

fetch packages by maintainer

Options:
  -s --sort <value>    sort by 'date', 'name', 'version', 'quality', 'popularity', 'maintenance', or 'score'
  -r --reverse         reverse sort order
  -o --org <value      filter packages by org
  -l --limit <number>  limit the number of packages returned
  -h, --help           display help for command
```

##

<br />

### Author:
#### yarn npm-pd author --help
Display packages by author.
```
Usage: npm-pd author [options] <name>

fetch packages by author

Options:
  -s --sort <value>    sort by 'name', 'version', 'date', 'quality', 'popularity', 'maintenance', or 'score'
  -r --reverse         reverse sort order
  -o --org <value      filter packages by org
  -l --limit <number>  limit the number of packages returned
  -h, --help           display help for command
```

<div align="center">
  <img width="624" alt="evaluate" src="https://raw.githubusercontent.com/bconnorwhite/npm-pd/master/assets/screenshot-maintainer.png" />
</div>

##

<br />

### Evaluate:
#### yarn npm-pd evaluate --help
Show search analysis for a package.
```
Usage: npm-pd evaluate [options] <name>

show search analysis for a package

Options:
  -h, --help  display help for command
```
<div align="center">
  <img width="312" alt="evaluate" src="https://raw.githubusercontent.com/bconnorwhite/npm-pd/master/assets/screenshot-evaluate.png" />
</div>

##

<br />

### Programmatic Usage:
Run npm-pd commands programmatically:
```ts
import { maintainerAction, authorAction, evaluateAction } from "npm-publisher-dashboard";
```
#### Types:
```ts
maintainerAction(name: string, options: PublisherOptions) => void;

authorAction(name: string, options: PublisherOptions) => void;

evaluateAction(name: string) => void;

type PublisherOptions = {
  sort?: SortBy;
  reverse?: boolean;
  org?: string;
  limit?: number;
}
```

##

<br />

### Commander Plugins:
Add npm-pd commands to any commander program:
```ts
import { program } from "commander";
import { maintainer, author, evaluate } from "npm-publisher-dashboard";

maintainer(program);
author(program);
evaluate(program);
```

##

<br />


<h2>Dependencies<img align="right" alt="dependencies" src="https://img.shields.io/david/bconnorwhite/npm-pd.svg"></h2>

- [@bconnorwhite/module](https://npmjs.com/package/@bconnorwhite/module): Set commander version based on your module's package.json.
- [chalk](https://npmjs.com/package/chalk): Terminal string styling done right
- [cli-table3](https://npmjs.com/package/cli-table3): Pretty unicode tables for the command line. Based on the original cli-table.
- [commander](https://npmjs.com/package/commander): The complete solution for node.js command-line programs
- [lodash](https://npmjs.com/package/lodash): Lodash modular utilities.
- [moment](https://npmjs.com/package/moment): Parse, validate, manipulate, and display dates
- [npms-io-client](https://npmjs.com/package/npms-io-client): Isomorphic typed client for npms.io
- [ora](https://npmjs.com/package/ora): Elegant terminal spinner
- [semver](https://npmjs.com/package/semver): The semantic version parser used by npm.
- [url](https://npmjs.com/package/url): The core `url` packaged standalone for use with Browserify.


##

<br />

<h2>Dev Dependencies<img align="right" alt="David" src="https://img.shields.io/david/dev/bconnorwhite/npm-pd.svg"></h2>

- [@bconnorwhite/bob](https://npmjs.com/package/@bconnorwhite/bob): Bob builds and watches typescript projects.
- [@types/lodash](https://npmjs.com/package/@types/lodash): TypeScript definitions for Lo-Dash
- [@types/node](https://npmjs.com/package/@types/node): TypeScript definitions for Node.js

##

<br />

<h2>License <img align="right" alt="license" src="https://img.shields.io/npm/l/npm-pd.svg"></h2>

[MIT](https://mit-license.org/)

##

<br />

## Related Packages
- [npms-io-client](https://npmjs.com/package/npms-io-client): Isomorphic typed client for npms.io
