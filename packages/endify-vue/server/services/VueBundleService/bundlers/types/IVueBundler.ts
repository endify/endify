export interface IVueBundler {
  watch(): Promise<unknown>
  load(): Promise<unknown>
  bundle: unknown
}