const http = require('http');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
const networkInterfaces = require('os').networkInterfaces()
const chalk = require('chalk');
const vm = require('../variable.config.js')
const util = require('../util')
const getConfig = require('./config')

// zlib 压缩文件js css
const zlibPublic = () => {
    const public = path.resolve(`${process.cwd()}`);
    // 获取当前静态资源下的css和js文件
    const files = util.dirIncludeFiles(public, ['.css', '.js'])

    for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        pipeline(
            fs.createReadStream(file),
            zlib.createGzip(),
            fs.createWriteStream(`${file}.gz`),
            // eslint-disable-next-line no-loop-func
            (error) => {
                if (error) {
                    console.error('压缩文件失败', error);
                } else {
                    console.log('压缩文件成功');
                }
            }
        );
    }
}
zlibPublic()

// // proxy html文件域名替换
const proxy = () => {
  getConfig((json) => {
    // 判断配置了proxy
    if (json.proxy) {
      // 获取当前静态资源下的html文件
      const files = util.dirIncludeFiles(path.resolve(`${process.cwd()}`), ['.html'])
      // html遍历替换json中rule属性规则
      files.forEach(file => {
          json.proxy.forEach(rule => {
              util.formatEntryFile({
                ...rule,
                path: file
              })
          })
      })
    }
  })
}
proxy()

function setHeaders (res, url) {
    if (serveStatic.mime.lookup(url) === 'text/html') {
        // Custom Cache-Control for HTML files
        res.setHeader('Cache-Control', 'public, max-age=5');
    } else if (/.css.gz|.js.gz/.test(url)) {
        res.setHeader('Content-Type', serveStatic.mime.lookup(url.replace('.gz', '')));
        res.setHeader('Content-Encoding', 'gzip');
    }
}

// Serve up public/ftp folder
const serve = serveStatic('.', {
    'index': ['index.html'],
    'setHeaders': setHeaders
});

// Server create
const server = http.createServer(function onRequest (req, res) {
    // 配合压缩
    if (/.css|.js$/.test(req.url)) {
        if (/\bgzip\b/.test(req.headers['accept-encoding'])) {
            req.url += '.gz';
        }

    }
    serve(req, res, finalhandler(req, res));
});

// Listen
// 读取端口，开启后删除
let portFile = path.resolve(`${__dirname}/../port.txt`)
let port = Number(fs.readFileSync(portFile))
server.listen(port, () => {
  console.log(chalk.green('启动成功'));
  const address = networkInterfaces.en0[1].address || networkInterfaces.eth0[0].address // 获取内网ip
  // 启动信息
  const notice = `
    http://localhost:${port},
    http://${address}:${port}

    提示：
    命令 (pm2 list) 查看当前pm2挂载进程
    命令 (pm2 delete <projectName>) 删除某个进程
    命令 (pm2 log) 查看日志
    更多命令请看pm2官网查看
  `
  //
  console.log(chalk.blue(notice))
  fs.unlinkSync(portFile) // 删除端口文件
});
