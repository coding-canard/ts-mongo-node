export class NotFoundError extends Error {
  statusCode: number;
  
  constructor (message: string) {
    super(message)
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name
    this.statusCode = 404;
  }
}