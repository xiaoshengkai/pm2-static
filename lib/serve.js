const util = require('util');
const exec = util.promisify(require('child_process').exec);
const chalk = require('chalk');
const path = require('path')
const fs = require('fs')
let vm = require('../variable.config.js')

// 判断pm2, 是否安装
const isPM2Exit = () => new Promise((resolve) => {
    exec('pm2 -h', (err) => {
        if (err) {
            console.log(chalk.red('请安装 pm2: npm i -g pm2, 重新再执行'));
            process.exit(1);
        }
        console.log(chalk.green('监测pm2已安装'));
        resolve();
    });
});

//判断进程是否已经启动，
const isRunning = async () => {
    try {
        await exec(`pm2 describe ${vm.projectName}`);
        await exec(`pm2 delete ${vm.projectName}`);
    } catch (e) {
        // console.log(e);
    }
};

// 启动静态服务
const run = async () => {
    let serverStaticZlibPath = path.resolve(`${__dirname}/serve-static-zlib.js`)
    try {
        const runHandle = await require('child_process').exec(`pm2 start --name ${vm.projectName} node ${serverStaticZlibPath}`);
        console.log(chalk.green('正在启动'));
        runHandle.stdout.on('data', (data) => {
            console.log(chalk.blue(`stdout: ${data}`));
        });
        runHandle.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        runHandle.on('close', (code) => {
            console.log(`子进程退出，退出码 ${code}`);
        });
    } catch (e) {
        console.log(e)
        console.log(chalk.red(`执行失败，请手动启动：pm2 start --name ${vm.projectName} node ${serverStaticZlibPath}`));
        process.exit(1);
    }
};
module.exports = async function server () {
    await isPM2Exit();
    await isRunning();
    await run();
}