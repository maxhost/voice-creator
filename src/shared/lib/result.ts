/**
 * Result type for explicit error handling.
 * Inspired by Rust's Result type.
 */
export type Result<T, E> =
  | { ok: true; data: T }
  | { ok: false; error: E };

/**
 * Creates a success Result.
 */
export const ok = <T>(data: T): Result<T, never> => ({
  ok: true,
  data,
});

/**
 * Creates a failure Result.
 */
export const err = <E>(error: E): Result<never, E> => ({
  ok: false,
  error,
});

/**
 * Unwraps a Result, throwing if it's an error.
 * Use only when you're certain the Result is ok.
 */
export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (!result.ok) {
    throw new Error(`Unwrap called on error: ${JSON.stringify(result.error)}`);
  }
  return result.data;
};

/**
 * Unwraps a Result with a default value if it's an error.
 */
export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  return result.ok ? result.data : defaultValue;
};
