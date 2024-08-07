/**
 * Types that don't fit anywhere else.
 */
export type AnyObject = Record<string, unknown>;

type NoElements<T> = { [P in keyof T]: never };
export type EmptyObject = NoElements<Record<string, never>>;

export type ChangeHandler<T = any> = (event: {
  type: string;
  target: { name: string; value: T };
}) => void;

export type PassValue<T = string> = (v: T) => void;

export type LookupById<T> = Record<string, T>;
