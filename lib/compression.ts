import zlib from "zlib";

/**
 * Compresses a string using gzip.
 */
export function compress(str: string): Promise<string> {
  return new Promise((resolve, reject) => {
    zlib.gzip(str, (err, buffer) => {
      if (err) {
        reject(err);
      }
      resolve(Buffer.from(buffer).toString("base64"));
    });
  });
}

/**
 * Decompresses a gzipped string.
 */
export function decompress(str: string): Promise<string> {
  return new Promise((resolve, reject) => {
    zlib.gunzip(Buffer.from(str, "base64"), (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result.toString("utf-8"));
    });
  });
}
