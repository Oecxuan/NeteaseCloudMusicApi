const fs = require('fs')
const path = require('path')
const tmpPath = require('os').tmpdir()
const { cookieToJson } = require('./util')
const generateConfig = require('./generateConfig')

// 确保 anonymous_token 文件存在（util/request.js 加载时会同步读取该文件）
if (!fs.existsSync(path.resolve(tmpPath, 'anonymous_token'))) {
  fs.writeFileSync(path.resolve(tmpPath, 'anonymous_token'), '', 'utf-8')
}

let initialized = false
/** @type {Record<string, any>} */
const moduleFns = {}

fs.readdirSync(path.join(__dirname, 'module'))
  .reverse()
  .forEach((file) => {
    if (!file.endsWith('.js')) return
    const fileModule = require(path.join(__dirname, 'module', file))
    const fn = file.split('.').shift() || ''
    moduleFns[fn] = function (data = {}) {
      if (typeof data.cookie === 'string') {
        data.cookie = cookieToJson(data.cookie)
      }
      return fileModule(
        {
          ...data,
          cookie: data.cookie ? data.cookie : {},
        },
        async (...args) => {
          if (!initialized) {
            initialized = true
            await generateConfig()
          }
          // 延迟加载 request，确保 anonymous_token 文件已就绪
          const request = require('./util/request')
          return request(...args)
        },
      )
    }
  })

/**
 * @type {Record<string, any> & import("./server")}
 */
module.exports = {
  ...require('./server'),
  ...moduleFns,
}
