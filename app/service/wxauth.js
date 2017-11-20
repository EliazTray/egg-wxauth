
'use strict'
// https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842
module.exports = app => {
  class Wxauth extends app.Service {
    constructor(ctx) {
      super(ctx)
      this.appid = app.config.wxauth.appid
      this.secret = app.config.wxauth.appsecret
      this.state = app.config.wxauth.state
      this.scope = app.config.wxauth.scope
    }
    // first, get `code` by redirectUrl,同时还需要appid,跳转地址,scope类型,以及自定义的state标记.
    getCode(redirectUri) {
      const appId = this.appid
      const state = this.state
      const scope = this.scope
      const getCodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
      this.ctx.redirect(encodeURI(getCodeUrl))
    }
    // 在第一步之后,会跳转到redirect_uri/?code=CODE&state=STATE中
    * getAccessToken() {
      // redirectUri中设置的回调地址会进入这个methods
      const { code, state } = this.ctx.query
      // 只有state等于配置中的state,才是微信浏览器返回的
      if (!state || state !== this.state) {
        // 就不允许访问
        return
      }
      const appId = this.appid
      const secret = this.secret
      const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${secret}&code=${code}&grant_type=authorization_code`
      let result
      try {
        result = yield this.ctx.curl(tokenUrl, {
          dataType: 'json',
        })
        // 如果存在错误码,则access_token获取失败
        if (result.data.errcode) {
          this.logger.error(`access_token获取失败: ${JSON.stringify(result.data)}`)
          return
        }
        this.logger.info(`getAccessToken的返回结果: ${JSON.stringify(result.data)}`)
        return result.data
      } catch (error) {
        this.logger.error(`getAccessToken接口异常: ${JSON.stringify(result.data)}`)
        return
      }
    }
    // 根据access_token接口的返回的token和userId,去获取用户的具体信息(在微信的dataBase中)
    * getUserInfo() {
      const data = yield this.getAccessToken()
      if (data) {
        const { access_token, openid } = data
        // 获取微信的用户数据
        // 如果前面传入的scope不一致,获取到数据信息量不一样
        const userinfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
        const getUserinfoPromise = Promise.resolve(this.ctx.curl(userinfoUrl, {
          dataType: 'json',
        }))
        let userData
        try {
          userData = yield getUserinfoPromise
        } catch (error) {
          this.logger.error('获取用户数据失败,' + JSON.stringify(error))
        }
        return userData
      }
    }
  }
  return Wxauth
}
