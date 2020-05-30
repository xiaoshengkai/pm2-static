const path = require('path')
const fs = require('fs')
const fo = require('./file-operate')

const dir = new fs.Dirent()

module.exports = {
  /**
   * 返回目录中指定类型文件路径集合
   * @param {String} public 文件夹绝对路径
   * @param {Array} fileType 指定文件类，如 ['.js']
   */
  dirIncludeFiles (public, fileType = []) {
    if (fs.statSync(public).isFile()) {
      console.log('Error：当前路径指向文件，请传入文件夹绝对路径')
      return []
    }
    return function recursion (dirPath = public, files = []) {
      // 读取文件夹
      let childFiles = fs.readdirSync(dirPath)
      status = 'end'
      // 遍历目录
      childFiles.forEach((childPath) => {
        // 解析子文件/文件夹路径
        childPath = path.resolve(`${dirPath}/${childPath}`)
        // 判断是否文件，不同处理
        if (fs.statSync(childPath).isFile()) {
          // 将文件路径放入集合
          if (fileType.includes(path.extname(childPath))) {
            files.push(childPath)
          }
        } else {
          // 递归子目录
          recursion(childPath, files)
        }
      })
      return files
    }()
  },
  /**
   * 文件内容替换
   * @param {RegExp} rule 正则匹配规则
   * @param {*} content 
   * @param {*} path 
   */
  async formatEntryFile ({ rule, content, path }) {
    try {
        const res = await fs.readFileSync(path);
        let text = res.toString();
        while (rule.test(text)) {
            text = text.replace(rule, content);
        }
        console.log('html过滤完成')
        await fs.writeFileSync(path, text);
    } catch (e) {
        console.log(e);
    }
  },
  // 向上查找文件
  upfindFile (dir, fileName) {
    if (fs.statSync(dir).isFile()) {
      console.log('Error：当前路径指向文件，请传入文件夹绝对路径')
      return []
    }
    return new Promise((resolve, reject) => {
      
    })
  },
  ...fo
}
