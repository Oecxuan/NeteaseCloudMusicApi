#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const tmpPath = require('os').tmpdir()

// 确保 anonymous_token 文件存在（util/request.js 加载时会同步读取）
const tokenFile = path.resolve(tmpPath, 'anonymous_token')
if (!fs.existsSync(tokenFile)) {
  fs.writeFileSync(tokenFile, '', 'utf-8')
}

async function start() {
  // 先获取真实 token 后再加载 server（使 util/request.js 读到有效值）
  const generateConfig = require('./generateConfig')
  await generateConfig()
  const { serveNcmApi } = require('./server')
  serveNcmApi({
    checkVersion: false,
  })
}
start()
