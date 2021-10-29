import {VueExtension} from '@endify/vue'

export default async function() {
  return {
    port: 3006,
    extensions: [
      new VueExtension({
        env: {
          DOLLAR_SIGN: '$',
        },
      }),
    ],
    extendApp({app}) {
      app.get('/siema', (req, res) => {
        res.send('No witam witam')
      })
    },
  }
}
