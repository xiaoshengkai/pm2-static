## 开发 pm2 部署静态资源npm包
结合pm2的守护进程能力，扩展pm2部署静态资源功能，比较轻量：10几k而已

#### 安装
```
npm i -g pm2-static
```

#### 简单的使用

进入静态资源文件，-n是pm2进程名，更好的知道自己的起的服务是什么样子的，默认8081
```
cd public<静态资源文件> && pm2-static -n project
```
<img src="http://mpv-blog.oss-cn-beijing.aliyuncs.com/image.png" width="1200" />

#### 更改自己的端口

```
pm2-static -n project -p 7777
```

#### 总的参数列表如下
```
pm2-static -h

Options:
  -v, --version               版本查看
  -p, --port <string>         选填：设置端口号，默认8081 (default: 8081)
  -n, --projectName <string>  必填：设置pm2进程名（唯一），设置前请检查是否唯一: pm2 list
  -h, --help                  display help for command
```

#### 还可以配置自己的pm2-static.config.js

目前配置较为简单如下


```
"proxy": [ // 使用正则的方式替换静态资源中所有html中的rule规则为content字段内容
    {
      "rule": new RegExp(/https:\/\/fedoc.souche-inc.com\/bury-quick\/\d.\d.\d/),
      "content": ""
    }
  ],
  "port": 7776, // 端口
  "projectName": "project" // 进程名
```
##### 使用方式：

将 pm2-static.config.js和静态资源文件dist放在同一级,优先使用配置文件数据

启动

```
pm2-static
```
