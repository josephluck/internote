import { Option, Some, None } from "space-lift";

export function getFirstWordFromString(str: string): Option<string> {
  return str.length ? Some(str.split(" ")[0]) : None;
}

export function combineStrings(arr: string[]): string {
  return arr.reduce((prev, curr) => prev.concat(curr), "");
}
