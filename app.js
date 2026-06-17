#!/usr/bin/env node
const { serveNcmApi } = require('./server')

async function start() {
  // 启动时获取 anonymous_token
  const generateConfig = require('./generateConfig')
  await generateConfig()
  serveNcmApi({
    checkVersion: false,
  })
}
start()
