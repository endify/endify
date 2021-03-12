export class HookService<HookTypes extends string> {
  public hooks: Record<HookTypes, unknown>

  constructor(hooks: Record<HookTypes, unknown>) {
    this.hooks = hooks
  }
}