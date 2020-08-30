#!/usr/bin/env node
import { program } from "commander";
import { version } from "@bconnorwhite/module";
import { maintainer, author, evaluate } from "../";

maintainer(program);
author(program);
evaluate(program);
version(program, __dirname);

program.name("npm-pd");

program.parse(process.argv);
