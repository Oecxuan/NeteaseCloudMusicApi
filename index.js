const { serveNcmApi } = require('./server')

// Vercel 入口：直接导出 Express app 实例
let app

async function init() {
  if (!app) {
    const generateConfig = require('./generateConfig')
    await generateConfig()
    app = await serveNcmApi({ checkVersion: false })
  }
  return app
}

// Vercel 无服务器函数处理
module.exports = async (req, res) => {
  app = await init()
  app(req, res)
}
