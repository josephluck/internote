import { FieldConstraintsMap, makeValidator } from "@josephluck/valley/lib/fp";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { useState } from "react";

import { InputProps } from "../styles/input";

type Fields = Record<string, any>;

type FilterType<O, T> = { [K in keyof O]: O[K] extends T ? K : never };

type FilterTypeForKeys<O, T> = FilterType<O, T>[keyof O];

export function useForm<Fs extends Fields>(
  initialValues: Fs,
  constraints: FieldConstraintsMap<Fs>
) {
  type StringKeys = FilterTypeForKeys<Fs, string>;

  type NumberKeys = FilterTypeForKeys<Fs, number>;

  const doValidate = makeValidator<Fs>(constraints);

  const [values, setValues] = useState(initialValues);

  const [touched, setTouched] = useState(() =>
    getInitialTouched(initialValues)
  );

  const [errors, setErrors] = useState<Record<keyof Fs, string>>(() =>
    pipe(
      doValidate(initialValues),
      E.swap,
      E.getOrElse(() => getInitialErrors(initialValues))
    )
  );

  const validate = (
    currentValues: Fs = values
  ): ReturnType<typeof doValidate> =>
    pipe(
      doValidate(currentValues),
      E.mapLeft((e) => {
        setErrors(e);
        return e;
      }),
      E.map((v) => {
        setErrors(getInitialErrors(initialValues));
        return v;
      })
    );

  const setAllTouched = () => {
    setTouched(
      Object.keys(initialValues).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        initialValues
      )
    );
  };

  const setValue = <Fk extends keyof Fs>(fieldKey: Fk, fieldValue: Fs[Fk]) => {
    const newValues: Fs = { ...values, [fieldKey]: fieldValue };
    setValues(newValues);
    validate(newValues);
  };

  const setValuesAndValidate = (vals: Partial<Fs>) => {
    const newValues: Fs = { ...values, ...vals };
    setValues(newValues);
    validate(newValues);
  };

  const submit = () => {
    setAllTouched();
    return validate();
  };

  const reset = () => {
    setValues(initialValues);
    setTouched(getInitialTouched(initialValues));
    setErrors(getInitialErrors(initialValues));
  };

  const registerBlur = <Fk extends keyof Fs>(fieldKey: Fk) => () => {
    setTouched((current) => ({ ...current, [fieldKey]: true }));
  };

  const registerOnChangeText = <Fk extends keyof Fs>(fieldKey: Fk) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue(fieldKey, event.target.value as Fs[Fk]);
  };

  const registerOnChangeNumber = <Fk extends keyof Fs>(fieldKey: Fk) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue(fieldKey, numberify(event.target.value) as Fs[Fk]);
  };

  const registerTextInput = <Fk extends StringKeys>(
    fieldKey: Fk
  ): Partial<InputProps> => ({
    value: values[fieldKey],
    error: errors[fieldKey],
    touched: touched[fieldKey],
    onBlur: registerBlur(fieldKey),
    onChange: registerOnChangeText(fieldKey),
  });

  const registerNumberInput = <Fk extends NumberKeys>(
    fieldKey: Fk
  ): Partial<InputProps> => ({
    value: values[fieldKey] ? values[fieldKey].toString() : values[fieldKey],
    error: errors[fieldKey],
    touched: touched[fieldKey],
    onBlur: registerBlur(fieldKey),
    onChange: registerOnChangeNumber(fieldKey),
  });

  return {
    values,
    touched,
    errors,
    validate,
    setValue,
    setValues: setValuesAndValidate,
    reset,
    submit,
    registerTextInput,
    registerNumberInput,
  };
}

const getInitialTouched = <Fs extends Record<string, any>>(
  fields: Fs
): Record<keyof Fs, boolean> =>
  Object.keys(fields).reduce(
    (acc, fieldKey) => ({ ...acc, [fieldKey]: false }),
    fields
  );

const getInitialErrors = <Fs extends Record<string, any>>(
  fields: Fs
): Record<keyof Fs, string> =>
  Object.keys(fields).reduce(
    (acc, fieldKey) => ({ ...acc, [fieldKey]: "" }),
    fields
  );

const isRequired = <T>(value: T): E.Either<string, T> =>
  Boolean(value) ? E.right(value) : E.left("Required");

const isOfType = (type: string) => <T>(value: T): E.Either<string, T> =>
  typeof value === type ? E.right(value) : E.left(`Expected a ${type}`);

const isString = isOfType("string");

const isNumber = isOfType("number");

const isEqualTo = <T>(expected: T) => <V extends T>(
  value: V
): E.Either<string, V> =>
  value === expected
    ? E.right(value)
    : E.left(`Expected ${value} to equal ${expected}`);

const isLengthAtLeast = (length: number) => (
  value: string
): E.Either<string, string> =>
  value.length >= length
    ? E.right(value)
    : E.left(`Must be at least ${length} characters long`);

const isEmail = (value: string): E.Either<string, string> =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    value
  )
    ? E.right(value)
    : E.left("Please enter a valid e-mail");

export const constraints = {
  isRequired,
  isOfType,
  isString,
  isNumber,
  isEqualTo,
  isLengthAtLeast,
  isEmail,
};

const numberify = (val: string): number | undefined => {
  const numbersOnly = val.replace(/\D/g, "");
  if (Number.isNaN(parseInt(numbersOnly))) {
    return undefined;
  }
  return parseInt(numbersOnly);
};
