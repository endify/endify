// import {EndifyServer} from '@endify/server'
// import {EndifyVuePlugin} from '@endify/vue'
// import {resolve} from 'path'

// export default () => {
//   return new EndifyServer({
//     port: 3123,
//     watch: false,
//     plugins: [
//       new EndifyVuePlugin({
//         env: {
//           DOLLAR_SIGN: '$'
//         },
//         entry: resolve('./client')
//       })
//     ],
//   })
// }
export default async function() {
  console.log('Hello server!')
  await new Promise(resolve => {
    setTimeout(resolve, 500)
  })
  console.log('Promise executed')
  return {
    port: 3002,
  }
}
