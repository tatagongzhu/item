// 1.1 引入express
const express = require('express');
// 4.1 引入数据库操作第三方库
const mysql = require('mysql');
// 4.2 创建连接对象
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'heima'
})
// 4.3 连接到数据
connection.connect();

// 1.2 初始化express
const app = express();

// 2.1 设置静态资源访问目录，用于存放静态页面
app.use(express.static('public'));

// 3.1 编写get方法，地址为/getHeroList的接口
app.get('/getHeroList', (req, res) => {
    // 3.2 通过数据库查询数据
    connection.query('select * from heros', (err, data) => {
        if (err) {
            // 3.3 如果查询错误，返回客户端错误信息
            res.json({ code: -1, msg: err })
        } else {
            // 3.4 把英雄数据返回到客户端
            res.json({ code: 200, data })
        }
    })
})

// 1.3 监听端口
app.listen(3001, (err) => {
    if (err) {
        console.log('服务器启动失败', err)
    } else {
        console.log('服务端启动成功')
    }
})