'use strict'

module.exports = () => {
  const config = exports = {}
  config.wxauth = {
    appid: '',
    appsecret: '',
    state: 'secret',
    scope: 'snsapi_base', // 没有给的话默认就是snsapi_base
  }
  return config
}
