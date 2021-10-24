export interface ILoggerService {
  log(...args): void
  error(...args): void
  success(...args): void
  warn(...args): void
  logHelloLine(): void
  clearLastLine(): void
}