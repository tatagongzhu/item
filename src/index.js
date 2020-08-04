// 1.1 引入express
const express = require('express');
const bodyParse = require('body-parser');

const router = require('./router')

// 1.2 初始化express
const app = express();

// 2.1 设置静态资源访问目录，用于存放静态页面
app.use(express.static('public'));
// 增加一个upload目录的静态目录
app.use(express.static('upload'));
// 对post请求参数进行处理
app.use(bodyParse.urlencoded())
// 使用路由
app.use(router)


// 1.3 监听端口
app.listen(3001, (err) => {
    if (err) {
        console.log('服务器启动失败', err)
    } else {
        console.log('服务端启动成功')
    }
})