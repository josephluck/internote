import { Option, Some, None } from "space-lift";

export function getFirstWordFromString(str: string): Option<string> {
  return str.length ? Some(str.split(" ")[0]) : None;
}

export function removeFirstLetterFromString(str: string): Option<string> {
  return str.length > 1 ? Some(str.substr(1)) : None;
}

export function combineStrings(arr: string[]): string {
  return arr.reduce((prev, curr) => prev.concat(curr), "");
}

export function hasLength<A extends string | any[]>(a: A): boolean {
  return a.length > 0;
}

export function getLength<A extends string | any[]>(a: A): number {
  return a.length;
}
