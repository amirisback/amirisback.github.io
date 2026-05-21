export function helloCommand(name?: string) {
  const targetName = name || "World";
  console.log(`Hello, ${targetName}! Welcome to Muhammad Faisal Amir CLI.`);
  return `Hello, ${targetName}! Welcome to Muhammad Faisal Amir CLI.`;
}
