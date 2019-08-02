import { compress, decompress } from "./compression";

describe("compression", () => {
  it("Compressed and decompressed given string", async () => {
    const str = JSON.stringify({ foo: "foo", bar: "bar" });
    const compressedStr = await compress(str);
    expect(compressedStr).toBeDefined();
    const decompressedStr = await decompress(compressedStr);
    expect(decompressedStr).toBeDefined();
    expect(decompressedStr).toEqual(str);
  });
});
