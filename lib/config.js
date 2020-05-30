const util = require('../util')
const path = require('path')

const proxyFile = path.resolve(`${process.cwd()}/../pm2-static.config.js`);

// 获取配置
module.exports = function getConfig () {
  return new Promise((resolve) => {
    // 判断是否有配置文件存在
    util.fileIsExist(proxyFile).then(() => {
      resolve(require(proxyFile))
    }).catch(e => {
      resolve({})
    })
  })
}