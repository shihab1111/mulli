class AppError extends Error {
  constructor(statusCode, message, stack = '') {
    super(message); // same as: throw new Error(message)

    this.statusCode = statusCode;
    this.name = this.constructor.name;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
