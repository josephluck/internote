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
  const defaultConstraint: Constraint = val =>
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
            [key]: err
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

export const required: Constraint = (val, key) =>
  val ? undefined : `${key} is required`;

export const rules = {
  required
};
