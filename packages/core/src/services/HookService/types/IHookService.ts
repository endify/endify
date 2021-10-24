export interface IHookService {
  registerHook<T>(name: string, hook: T): T
  getHook<T>(name: string): T
}
