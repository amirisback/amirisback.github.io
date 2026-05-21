import { describe, it, expect, vi } from "vitest";
import { helloCommand } from "./hello";

describe("helloCommand", () => {
  it("should greet World when no name is provided", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    const result = helloCommand();
    
    expect(result).toBe("Hello, World! Welcome to Amir App CLI.");
    expect(consoleSpy).toHaveBeenCalledWith("Hello, World! Welcome to Amir App CLI.");
    
    consoleSpy.mockRestore();
  });

  it("should greet the provided name", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    const result = helloCommand("Amir");
    
    expect(result).toBe("Hello, Amir! Welcome to Amir App CLI.");
    expect(consoleSpy).toHaveBeenCalledWith("Hello, Amir! Welcome to Amir App CLI.");
    
    consoleSpy.mockRestore();
  });
});
