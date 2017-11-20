# egg-wxauth

> this is an plugin for weixin Auth2.

## Documention

1. install

in your command line, type `npm install egg-wxauth -S`

```bash
  npm install egg-wxauth -S
```

2. update config

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
