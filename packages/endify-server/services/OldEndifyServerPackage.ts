export class OldEndifyServerPackage {
  init(hooks) {
    hooks('@endify/cli', '').tap('EndifyServerPackage', () => {

    })
  }
}
