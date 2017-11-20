# egg-wxauth

> this is an plugin for weixin Auth2.

## Documention

### 1.install

in your command line, type `npm install egg-wxauth -S`

```bash
  npm install egg-wxauth -S
```

### 2.update config

in egg project, find your config directory, then do like below

***config/plugin.js*** 

```js
// make `wxauth` plugin enabled
exports.wxauth = {
  enabled: true,
  package: 'egg-wxauth',
}
```

***config/config.default.js***

```js
config.wxauth = {
  appid: 'appid', // your appid
  appsecret: 'appsecret', // your appsecret
  // scope: 'snsapi_base', 'snsapi_base' default
}
```

### 3. Use as serveice

after 1 && 2 steps, it is auto injected into `egg context` already.then you can use `this.ctx.service.wxauth` to get methods what you want.

***your service or controller.js***

```js
'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
  * index() {
    // use egg-session(you can do this depend on your project)
    if (this.ctx.session.user) {
      // if user logged, then redirect to  your `loggin url`(http://egg.inrice.top/main)
      // `http://egg.inrice.top/main` exposed to user.
      this.ctx.redirect('http://egg.inrice.top/main')
    } else {
      // redirect url(use for getting the callback by weixin)
      this.ctx.service.wxauth.getCode('http://egg.inrice.top/auth?')
    }
  }
  // if weixin return a request, it will be enter `auth` methods that you defined.
  * auth() {
    const userData = yield this.ctx.service.wxauth.getUserInfo()
    if (!this.ctx.session.user) {
      this.ctx.session.user = userData
    }
    this.ctx.redirect('http://egg.inrice.top/main')
  }
  * main() {
    this.ctx.body = 'loggin success, this is your loggin url'
  }
}

module.exports = HomeController

```

### 4.API

- getCode (redirectUrl)

This is a method for sending authorization requests to WeChat... After waiting for user action (if the scope is silent authorization to jump to `redirectUrl`), WeChat sends a get request to our `redirectUrl`.

- getAccessToken()

This is a method for getting `access_token` and `openid` etc.like below

[see detail](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842)

```json
{
 "access_token":"ACCESS_TOKEN",
 "expires_in":7200,
 "refresh_token":"REFRESH_TOKEN",
 "openid":"OPENID",
 "scope":"SCOPE"
}
```

- getUserInfo(),

This i a method for getting UseInfo when `scope` is `snsapi_userinfo`(otherwise, you don't need to use this method), [see detail](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842)

when `scope` is `snsapi_userinfo`

```json
{
 "openid":" OPENID",
 " nickname": "Mr.Right",
 "sex":"1",
 "province":"PROVINCE",
 "city": "CITY",
 "country":"COUNTRY",
 "headimgurl":"http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46",
"privilege":[ "PRIVILEGE1" "PRIVILEGE2"],
 "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
}
```