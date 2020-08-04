const express = require('express');
const formidable = require('formidable');
const path = require('path');
// 获取路由对象
const router = express.Router();
const model = require('./model')
const tokenUtil = require('./token');

// 设置允许跨域请求
router.all('*',(req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    // 设置完请求头后，交给后续的中间件进行处理
    next()
});

// 3.1 编写get方法，地址为/getHeroList的接口
router.get('/getHeroList', (req, res) => {
    tokenUtil.checkRole(req, res);
    // 3.2 通过数据库查询数据
    model.getHeroList((err, data) => {
        if (err) {
            // 3.3 如果查询错误，返回客户端错误信息
            res.json({ code: -1, msg: err })
        } else {
            // 3.4 把英雄数据返回到客户端
            res.json({ code: 200, data })
        }
    })
})

// 删除数据接口
router.get('/delHeroById', (req, res) => {
    tokenUtil.checkRole(req, res);
    // 获取请求参数
    // req.query; { id: 1 }
    const { id } = req.query;
    model.deleteHeroById(id, (err, data) => {
        if (err) {
            res.json({ code: -1, msg: '删除失败' })
        } else {
            res.json({ code: 200, msg: '删除成功'})
        }
    })
})

// 新增英雄接口
router.post('/addHero', (req, res) => {
    // 获取post请求参数
    const { name, gender, img } = req.body;
    // 把数据写入数据库
    model.addHero(name, gender, img, (err, data) => {
        if (err) {
            res.json({ code: -1, msg: '新增失败' })
        } else {
            res.json({ code: 200, msg: '新增成功'})
        }
    })
})

// 图片上传
router.post('/uploadFile', (req, res) => {
    console.log(req.body); // 是一个空对象 {}
    // 利用第三方库帮助我们处理上传
    const form = formidable({
        uploadDir: path.join(__dirname, '../upload'), // 设置上传目录
        keepExtensions: true // 保存上传文件的后缀
    });
    form.parse(req, (err, fields, files) => {
        // 读取上传文件的路径
        const filePath = files.avatar.path;
        console.log(filePath) // D:\xboss\上课\53期\express项目实战\02-代码\01-英雄管理\upload\upload_6aa37cea59cadb86b3b61797d0e07e20.jpg
        // 截取文件名, path.basename用于截取全路径经的文件路径
        const fileName = path.basename(filePath)
        res.json({ code: 0, src: fileName })
      });
})

// 定义通过英雄id获取英雄数据的接口
router.get('/getHeroById', (req, res) => {
    // 英雄id
    const { id } = req.query;
    model.getHeroById(id, (err, data) => {
        if (err) {
            res.json({ code: -1, msg: '获取失败'})
        } else {
            res.json({ code:200, data: data[0] })
        }
    })
})

// 更新英雄信息
router.post('/updateHero', (req, res) => {
    const { name, gender, img, id } = req.body;
    // 调用数据层updateHero方法，写入数据库
    model.updateHero(id, name, gender, img, (err, data) => {
        if (err) {
            res.json({ code: -1, msg: '更新失败'})
        } else {
            res.json({ code:200, msg: '更新成功' })
        }
    });
})

// 登录
router.post('/login', (req, res) => {
    model.login(req.body, (err, result) => {
      if (err) {
        res.json({ code: -1, msg: err })
      } else if (result.length === 0) {
        res.json({ code: -1, msg: '用户不存在或者密码错误' })
      } else {
        //   创建token
        const myToken = tokenUtil.createToken(req.body.username)
        res.json({ code: 200, msg: '登录成功', token: myToken })
      }
    })
});

// 用户注册
router.post('/register', (req, res) => {
    // 调用model层，把数据存到数据库
    model.register(req.body, (err, result) => {
      if (err) {
        res.json({ code: -1, msg: err })
      } else {
        res.json({ code: 200, msg: '注册成功'});
      }
    })
  })

// 导出路由对象
module.exports = router;