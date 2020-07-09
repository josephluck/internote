import * as fs from "fs";
import * as path from "path";

import { FULL_SCHEMA_WELCOME_MESSAGE } from "@internote/lib/schema-examples";

import { serializeMarkdown } from "./markdown";

describe("Serializers / markdown", () => {
  it("Serializes a complex schema to markdown", async () => {
    const expected = await getFile("./markdown-example.md");
    const result = serializeMarkdown(FULL_SCHEMA_WELCOME_MESSAGE);
    await writeFile(result, "./markdown-export.md");
    expect(result).toEqual(expected);
  });
});

const writeFile = (
  content: string,
  relativePathToOutput: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.resolve(__dirname, relativePathToOutput),
      content,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

const getFile = (relativePathToFile: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, relativePathToFile), (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString("utf-8"));
      }
    });
  });
};
