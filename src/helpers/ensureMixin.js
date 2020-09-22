export function ensureMixin(component, mixin) {
  if(component.mixins) {
    component.mixins.push(mixin)
  } else {
    component.mixins = [
      mixin
    ]
  }
  return component
}