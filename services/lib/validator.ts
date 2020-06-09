import { Ok, Err, Result } from "space-lift";

type Constraint = (
  field: any,
  key: string,
  fields: Record<string, any>
) => string | undefined;

export type Constraints<M extends Record<string, any>> = Record<
  keyof M,
  Constraint[]
>;

function makeValidator<C extends Record<string, any>>(
  /**
   * An object of constraints to be validated against
   */
  constraints: Constraints<C>,
  /**
   * Don't allow for any fields that are not specified in constraints.
   */
  strictInput = true
) {
  const defaultConstraint: Constraint = (val) =>
    strictInput ? `Unexpected field ${val}` : undefined;

  return function validate<F extends Record<string, any>>(
    fields: F
  ): Partial<Record<keyof F & keyof C, string>> {
    const fieldKeys = Object.keys(fields);
    const constraintKeys = Object.keys(constraints);
    const keys = strictInput
      ? [...new Set([...fieldKeys, ...constraintKeys])]
      : constraintKeys;
    return keys.reduce((errors, key) => {
      const constraint = constraints[key] || [defaultConstraint];
      const field = fields[key];
      const err = constraint.reduce(
        (err, con) => err || con(field, key, fields),
        undefined
      );
      return err
        ? {
            ...errors,
            [key]: err,
          }
        : errors;
    }, {});
  };
}

function isValid<F>(errors: Partial<Record<keyof F, string>>): boolean {
  return Object.keys(errors).length === 0;
}

export function validate<C extends Record<string, any>, F extends any>(
  constraints: Constraints<C>,
  fields: F,
  /**
   * Don't allow for any fields that are not specified in constraints.
   */
  strictInput = true
) {
  const errors = makeValidator(constraints, strictInput)(fields);
  const result = isValid(errors) ? Ok(fields) : Err(errors);
  return result as Result<typeof errors, typeof fields>;
}

export const validateArrayItems = (
  constraints: Record<string, Constraint[]>
): Constraint => (val: any[]) => {
  const results = val.map((fields) => validate(constraints, fields));
  const invalidIndex = results.findIndex((result) => !result.isOk());
  if (invalidIndex >= 0) {
    return `Item ${invalidIndex} is invalid: ${JSON.stringify(
      results[invalidIndex].get()
    )}`;
  } else {
    return undefined;
  }
};

export const required: Constraint = (val, key) =>
  typeof val !== "undefined" ? undefined : `${key} is required`;

export const isString: Constraint = (val, key) =>
  typeof val === "string" ? undefined : `${key} must be a string`;

export const inArray = <A extends any>(arr: A[]): Constraint => (val, key) =>
  arr.includes(val)
    ? undefined
    : `${key} is not in the available range of options`;

export const isSingleWord: Constraint = (val, key) =>
  val.trim().split(" ").length === 1
    ? undefined
    : `${key} must be a single word`;

export const isArray = (
  check: (v: any) => boolean = () => true
): Constraint => (val, key) =>
  Array.isArray(val) && val.every(check)
    ? undefined
    : `${key} must be an array`;

export const rules = {
  required,
};
