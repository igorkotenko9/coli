export { isPlainObject } from "lodash";

// TODO: убрать с заменой на методы из lodash

export const isHTMLElement = (value: unknown): value is HTMLElement =>
  typeof HTMLElement === "object"
    ? value instanceof HTMLElement
    : Boolean(
        value &&
        typeof value === "object" &&
        value !== null &&
        "nodeType" in value,
      );

export const isString = (value: unknown): value is string =>
  typeof value === "string";

export const isNumber = (value: unknown): value is number =>
  typeof value === "number" && !Number.isNaN(value);

export const isBigInt = (value: unknown): value is bigint =>
  typeof value === "bigint";

export const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

export const isSymbol = (value: unknown): value is symbol =>
  typeof value === "symbol";

export const isUndefined = (value: unknown): value is undefined =>
  typeof value === "undefined";

export const isNull = (value: unknown): value is null => value === null;

export const isFunction = (value: unknown): value is () => any =>
  typeof value === "function";

export const isArray = <T>(value: unknown): value is T[] =>
  Array.isArray(value);

export const isDate = (value: unknown): value is Date => value instanceof Date;
