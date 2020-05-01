/* eslint-disable functional/no-loop-statement */
/* eslint-disable functional/no-let */
export function rangeScalaNames(name: string, length: number): string {
  let result = "";

  for (let i = 0; i <= length; i++) {
    result += `scalar ${name}${i}\n`;
  }

  return result;
}
