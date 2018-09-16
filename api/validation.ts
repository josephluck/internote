import { makeValidator, Constraints, Constraint } from "mandle";
import { Ok, Err, Result } from "space-lift";

function isValid<F>(errors: Partial<Record<keyof F, string>>): boolean {
  return Object.keys(errors).reduce((prev, key) => {
    return prev && !!errors[key];
  }, true);
}

export function validate<F extends Record<string, any>>(
  fields: F,
  constraints: Constraints<F>
): Result<Partial<Record<keyof F, string>>, F> {
  const validator = makeValidator(constraints);
  const response = validator(fields);
  return isValid<F>(response) ? Ok(fields) : Err(response);
}

export const required: Constraint<{}> = val => (!!val ? "Required" : undefined);

export const rules = {
  required
};
