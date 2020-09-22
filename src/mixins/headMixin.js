import {ClientHelper} from '../helpers/ClientHelper'

function defaultHeadValues() {
  return {
    title: 'Endify app'
  }
}
function headObjectToValues(head) {
  let values = {}
  if(typeof head !== 'object') {
    return defaultHeadValues()
  }
  return {
    ...values,
    title: head.title || values.title
  }
}

function getHead(vm) {
  let {head} = vm.$options
  if(typeof head === 'function') {
    head = head.call(vm)
  }
  return headObjectToValues(head)
}

const serverHeadMixin = {
  created() {
    const {title} = getHead(this)
    if(this.$ssrContext) {
      this.$ssrContext.endifyHead = `
      <title>${title}</title>
      `
    }
  }
}

const clientHeadMixin = {
  mounted() {
    const {title} = getHead(this)
    if (title) {
      document.title = title
    }
  }
}

export default typeof ClientHelper.isServer ? serverHeadMixin : clientHeadMixin
