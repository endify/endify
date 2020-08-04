const path = require('path')
const { spawn } = require('child_process');

const handle = () => {
  spawn('node', [path.join(process.cwd(), '/dist/api/server.js')], {
    stdio: ['pipe', 'inherit', 'inherit'],
    env: {
      ...process.env,
      NODE_ENV: 'production',
    }
  })
}

module.exports = handle

