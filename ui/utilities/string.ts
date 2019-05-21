import { Option, Some, None } from "space-lift";

export function getFirstWordFromString(str: string): Option<string> {
  return str.length ? Some(str.split(" ")[0]) : None;
}
