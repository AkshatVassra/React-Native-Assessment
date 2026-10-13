/**
 * Base Failure class for Clean Architecture.
 * Separates technical exceptions from domain-level failures.
 */
export abstract class Failure {
  readonly message: string;
  readonly code?: string;

  constructor(message: string, code?: string) {
    this.message = message;
    this.code = code;
  }
}

export class ServerFailure extends Failure {
  constructor(message = 'Server communication error occurred.', code?: string) {
    super(message, code);
  }
}

export class AuthFailure extends Failure {
  constructor(message = 'Authentication failed. Please check your credentials.', code?: string) {
    super(message, code);
  }
}

export class CacheFailure extends Failure {
  constructor(message = 'Failed to load or save data to local storage.', code?: string) {
    super(message, code);
  }
}

export class ValidationFailure extends Failure {
  constructor(message = 'Validation error occurred.', code?: string) {
    super(message, code);
  }
}

export class NetworkFailure extends Failure {
  constructor(message = 'Network connection unavailable. Operating in offline mode.', code?: string) {
    super(message, code);
  }
}
