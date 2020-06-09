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

export function stringIsOneWord(str: string): boolean {
  return str.split(" ").length === 1;
}

/**
 * Takes either two strings or two arrays of strings
 * or a mix and returns whether there are any overlapping
 * occurrences between them.
 */
export function anyOverlappingStrOccurrences(
  strA: string | string[],
  strB: string | string[]
): boolean {
  if (typeof strA === "object" && typeof strB === "object") {
    return strA.some((a) => strB.some((b) => b === a));
  } else if (typeof strA === "object") {
    return strA.some((a) => a === strB);
  } else if (typeof strB === "object") {
    return strB.some((b) => b === strA);
  } else {
    return strA === strB;
  }
}
