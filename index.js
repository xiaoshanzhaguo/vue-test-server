// 1.1 引入express
const express = require('express')

// 1.2 定义一个app，是express的实例
const app = express()

// 1.6 加一个跨域模块
app.use(require('cors')())

// 1.7 加一个中间件
app.use(express.json())

// 1.4 引用 这样就能实现在admin里面使用app
require('./routes/admin')(app)  // !!!

// 1.5 引用数据库
require('./plugins/db')(app)

// 1.3 启动在3000端口，同时传入一个回调函数，表示的是启动之后做什么
app.listen(3000, () => {
    console.log('http://localhost:3000');
})
