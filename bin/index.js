#!/usr/bin/env node
const { program } = require('commander')
let vm = require('../variable.config.js')
const serve = require('../lib/serve')
const chalk = require('chalk');
const { version, bin } = require('../package.json')
const fs = require('fs')
const path = require('path')

// 处理指令参数
const commande = () => new Promise((resolve) => {
  // 设置版本
  program
    .version(version, '-v, --version', '版本查看')
    .description('版本查看')
    .action(resolve)

  // 设置参数
  program
    .option('-p, --port <string>', `选填：设置端口号，默认${vm.port}`, vm.port)
    .option('-n, --projectName <string>', '必填：设置pm2进程名（唯一），设置前请检查是否唯一: pm2 list')
  // 解析
  program.parse(process.argv)
  // json
  require('../lib/config')().then((json) => {
    // 设置进程名称
    vm.projectName = json.projectName || program.projectName
    // 将端口存入文件，供其他进程读取
    fs.writeFileSync(path.resolve(`${__dirname}/../port.txt`), json.port || projectName.port)
    if (!vm.projectName) {
      const mainComande = Object.keys(bin)[0]
      console.log(chalk.red(`请设置项目名，比如命令 ${mainComande} -n 项目名称`));
      process.exit(1);
      
    }
    // 结束
    resolve()
  })
})

// 启动
commande()
.then(serve)

