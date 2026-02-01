/// <reference types="vite/client" />

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

interface ObjectConstructor {
  fromEntries<T = any, K extends PropertyKey = PropertyKey>(
    entries: Iterable<readonly [K, T]>,
  ): Record<K, T>;
}

type IfUnknownOrAny<T, Y, N> = unknown extends T ? Y : N;
type IfAny<T, Y, N> = (T extends never ? 1 : 0) extends 0 ? N : Y;

type ArrayType<T> = IfUnknownOrAny<
  T,
  IfAny<T, T[] extends T ? T[] : T[] & T, any[] & T>,
  Extract<T, readonly any[]>
>;

interface ArrayConstructor {
  isArray<T>(arg: T): arg is ArrayType<T>;
}

type Falsy = "" | 0 | false | null | undefined;
interface Array<T> {
  /**
   * Returns the elements of an array that meet the condition specified in a callback function.
   * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
   */
  filter<S extends T>(
    predicate: BooleanConstructor,
    thisArg?: any,
  ): Exclude<S, Falsy>[];
}
