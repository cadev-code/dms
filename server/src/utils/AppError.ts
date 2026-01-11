export class AppError extends Error {
  status: number;
  code: string;
  logMessage?: string;

  constructor(
    message: string,
    status: number,
    code: string,
    logMessage: string,
  ) {
    super(message); // la variable message del padre (Error)
    this.status = status;
    this.code = code;
    this.logMessage = logMessage;
  }
}
