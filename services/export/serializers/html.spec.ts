import * as fs from "fs";
import * as path from "path";
import { serialize } from "./html";
import schema from "./schema-example";

describe("Serializers / html", () => {
  it("Serializes a complex schema to html", async () => {
    const expected = await getFile("./html-example.html");
    const result = serialize(schema as any);
    await writeFile(result, "./html-export.html");
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
      err => {
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
