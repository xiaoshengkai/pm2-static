const fs = require('fs')
const chalk = require('chalk');

module.exports = {
  /**
   * 判断文件/文件夹是否存在
   * @param {String} path 文件路径
   */
  fileIsExist (path) {
    return new Promise((resolve, reject) => {
      fs.access(path, (err) => {
        (!err) ? resolve() : reject(err);
      })
    })
  },
  // 创建文件
  createFile (path, data) {
    return new Promise((resolve) => {
      fs.writeFile(path, data, (err) => {
        if (err) {
          console.log(chalk.red(err.toString()))
          process.exit(1)
        }
        resolve()
      })
    })
  },
  // 读取文件
  readFile (path) {
    return new Promise((resolve) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          console.log(chalk.red(err.toString()))
          process.exit(1)
        }
        resolve(data)
      })
    })
  },
}