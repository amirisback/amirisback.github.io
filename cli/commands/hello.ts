export function helloCommand(name?: string) {
  const targetName = name || "World";
  console.log(`Hello, ${targetName}! Welcome to Amir App CLI.`);
  return `Hello, ${targetName}! Welcome to Amir App CLI.`;
}
