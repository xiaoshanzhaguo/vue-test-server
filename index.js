// 1.1 引入express
const express = require('express')

// 1.2 定义一个app，是express的实例
const app = express()

// 1.6 加一个跨域模块
app.use(require('cors')())

// 1.7 加一个中间件
app.use(express.json())

// 1.4 引用 这样就能实现在admin里面使用app
require('./routes/admin')(app) // !!!

// 1.5 引用数据库
require('./plugins/db')(app)

/* 【接口登录】 加一个全局的属性，我们可以给app加一个东西
app.set表示在当前的express实例上面设置一个变量。第二个值应该放在环境变量里，不应该保存在代码里。
但是我们是为了简单得教学，因此放在这里简单一点。 */
app.set('secret', 'fasfafdu89')

// 1.3 启动在3000端口，同时传入一个回调函数，表示的是启动之后做什么
app.listen(3000, () => {
    console.log('http://localhost:3000');
})