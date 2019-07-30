import { validate, required } from "./validator";

describe("validator", () => {
  it("Returns the valid fields when valid", () => {
    const input = {
      a: "a",
      b: "b"
    };
    const constraints = {
      a: [required],
      b: [required]
    };
    const result = validate(constraints, input);
    expect(result.type).toEqual("ok");
    result.map(err => {
      expect(err).toEqual({ a: "a", b: "b" });
    });
  });

  it("Returns errors for required fields", () => {
    const input = {
      a: "a",
      b: ""
    };
    const constraints = {
      a: [required],
      b: [required]
    };
    const result = validate(constraints, input);
    expect(result.type).toEqual("err");
    result.mapError(err => {
      expect(Object.keys(err)).toEqual(["b"]);
    });
  });

  it("Allows for multiple validation rules per field", () => {
    const input = {
      a: "a",
      b: "c"
    };
    const constraints = {
      a: [required],
      b: [
        required,
        (val: string) => (val === "b" ? undefined : "Should equal b")
      ]
    };
    const result = validate(constraints, input);
    expect(result.type).toEqual("err");
    result.mapError(err => {
      expect(Object.keys(err)).toEqual(["b"]);
      expect(err.b).toEqual("Should equal b");
    });
  });

  it("Throws an error when extra fields are present by default", () => {
    const input = {
      a: "a",
      b: "b"
    };
    const constraints = {
      a: [required]
    };
    const result = validate(constraints, input);
    expect(result.type).toEqual("err");
    result.mapError(err => {
      expect(Object.keys(err)).toEqual(["b"]);
    });
  });

  it("Ignores extra fields when not in strict mode", () => {
    const input = {
      a: "a",
      b: "b"
    };
    const constraints = {
      a: [required]
    };
    const result = validate(constraints, input, false);
    expect(result.type).toEqual("ok");
  });

  it("Ignores extra fields when not in strict mode but still validates fields with constraints", () => {
    const input = {
      a: "",
      b: "b"
    };
    const constraints = {
      a: [required]
    };
    const result = validate(constraints, input, false);
    expect(result.type).toEqual("err");
    result.mapError(err => {
      expect(Object.keys(err)).toEqual(["a"]);
    });
  });
});