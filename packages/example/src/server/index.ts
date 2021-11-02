import {VueExtension} from '@endify/vue/extension'
import {resolve} from 'path'

export default async function() {
  return {
    port: 3006,
    extensions: [
      new VueExtension({
        env: {
          DOLLAR_SIGN: '$',
        },
        htmlTemplatePath: require.resolve('../client/template.html')
      }),
    ],
    extendApp({app}) {
      app.get('/siema', (req, res) => {
        res.send('No witam witam')
      })
    },
  }
}
