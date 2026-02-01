export type RecursiveCopy<T, U> = {
  [key in keyof T]: T[key] extends Array<infer A>
    ? A extends { [key: string]: any }
      ? RecursiveCopy<A, U>[]
      : U
    : T[key] extends { [key: string]: any }
      ? RecursiveCopy<T[key], U>
      : U;
};
