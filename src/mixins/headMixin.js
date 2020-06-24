import {ClientHelper} from '../helpers/ClientHelper'

function getHead(vm) {
  const {head} = vm.$options
  let headString = head

  if(typeof headString === 'function') {
    headString = headString.call(vm)
  }

  if(typeof headString === 'string') {
    return headString
  }

  //TODO: Convert object to head and remove plain string option
  return null
}

const serverHeadMixin = {
  created() {
    const head = getHead(this)
    if(head && this.$ssrContext) {
      this.$ssrContext.endifyHead = head
    }
  }
}

const clientHeadMixin = {
  // mounted() {
  //   const {title} = getHead(this)
  //   if (title) {
  //     document.title = title
  //   }
  //   //TODO: Head logic
  // }
}

export default typeof ClientHelper.isServer ? serverHeadMixin : clientHeadMixin
