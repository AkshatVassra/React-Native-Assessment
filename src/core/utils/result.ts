import { Failure } from '../errors/failures';

/**
 * Functional Result type for Clean Architecture (Either Success or Failure).
 */
export type Result<T> =
  | { success: true; data: T; error?: never }
  | { success: false; error: Failure; data?: never };

export const Result = {
  ok<T>(data: T): Result<T> {
    return { success: true, data };
  },
  fail<T>(error: Failure): Result<T> {
    return { success: false, error };
  },
};
