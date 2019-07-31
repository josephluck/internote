import zlib from "zlib";

/**
 * Compresses a string using gzip.
 */
export function compress(str: string): Promise<string> {
  return new Promise((resolve, reject) => {
    zlib.gzip(Buffer.from(str, "utf-8"), (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result.toString());
    });
  });
}

/**
 * Decompresses a string.
 */
export function decompress(str: string): Promise<string> {
  return new Promise((resolve, reject) => {
    zlib.deflate(str, (err, result) => {
      if (err) {
        reject(err);
      }

      resolve(result.toString());
    });
  });
}
