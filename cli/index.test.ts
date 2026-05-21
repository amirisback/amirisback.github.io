import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from "vitest";
import { runCli } from "./index";
import * as helloModule from "./commands/hello";

describe("runCli", () => {
  let consoleLogSpy: MockInstance;
  let consoleErrorSpy: MockInstance;
  let processExitSpy: MockInstance;
  let helloCommandSpy: MockInstance;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    processExitSpy = vi.spyOn(process, "exit").mockImplementation((() => {}) as unknown as (code?: number) => never);
    helloCommandSpy = vi.spyOn(helloModule, "helloCommand").mockImplementation(() => "mocked");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should show help when no command is provided", async () => {
    await runCli([]);
    expect(consoleLogSpy).toHaveBeenCalled();
    expect(consoleLogSpy.mock.calls[0][0]).toContain("Usage:");
  });

  it("should show help when --help flag is provided", async () => {
    await runCli(["--help"]);
    expect(consoleLogSpy).toHaveBeenCalled();
    expect(consoleLogSpy.mock.calls[0][0]).toContain("Usage:");
  });

  it("should call helloCommand when 'hello' command is provided", async () => {
    await runCli(["hello"]);
    expect(helloCommandSpy).toHaveBeenCalledWith(undefined);
  });

  it("should call helloCommand with name when -n flag is provided", async () => {
    await runCli(["hello", "-n", "Budi"]);
    expect(helloCommandSpy).toHaveBeenCalledWith("Budi");
  });

  it("should show error and help for unknown command", async () => {
    await runCli(["unknown-command"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Unknown command: unknown-command");
    expect(consoleLogSpy).toHaveBeenCalled(); // showHelp
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
