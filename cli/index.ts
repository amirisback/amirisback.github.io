import { parseArgs } from "node:util";
import { helloCommand } from "./commands/hello";

const args = process.argv.slice(2);

const options = {
  name: {
    type: "string",
    short: "n",
  },
  help: {
    type: "boolean",
    short: "h",
  },
} as const;

export async function runCli(argsArray: string[]) {
  try {
    const { values, positionals } = parseArgs({
      args: argsArray,
      options,
      allowPositionals: true,
    });

    const command = positionals[0];

    if (values.help || !command) {
      showHelp();
      return;
    }

    switch (command) {
      case "hello":
        helloCommand(values.name as string);
        break;
      default:
        console.error(`Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("Unknown error occurred");
    }
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
Amir App CLI

Usage:
  bun run cli <command> [options]

Commands:
  hello       Prints a greeting message.
              Options:
                -n, --name <string>   Name to greet (default: "World")

Options:
  -h, --help  Show help menu
  `);
}

import { pathToFileURL } from "node:url";

// Only run if called directly and not in test environment
if (process.env.NODE_ENV !== "test" && process.argv[1]) {
  try {
    if (import.meta.url === pathToFileURL(process.argv[1]).href) {
      runCli(args);
    }
  } catch (e) {
    // Ignore invalid URLs
  }
}
