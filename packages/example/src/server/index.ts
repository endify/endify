// import {EndifyVueExtension} from '@endify/vue'
// import {resolve} from 'path'

export default async function() {
  return {
    port: 3005,
    extensions: [
      // new EndifyVueExtension({
      //   env: {
      //     DOLLAR_SIGN: '$',
      //   },
      //   entry: resolve('./client'),
      // }),
    ],
    extendApp({app}) {
      app.get('/siema', (req, res) => {
        res.send('No witam witam')
      })
    },
  }
}
