import { handler } from "./update";

describe("update", () => {
  it("Should handle bad requests", () => {
    const body: any = { colorTheme: "" };
    handler(
      {
        httpMethod: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      } as any,
      {} as any,
      (_err, res) => {
        expect(res).toBeDefined();
        expect(res.statusCode).toEqual(400);
      }
    );
  });
});
