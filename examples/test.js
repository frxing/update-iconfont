let UpdateIconfont = require('../lib/updateIconfont.min.js')
const path = require('path')

new UpdateIconfont({
  url: '',
  cookie: '',
  output: {
    path: path.resolve(__dirname, './font'),
    fileName: 'iconfont.css'
  }
})

