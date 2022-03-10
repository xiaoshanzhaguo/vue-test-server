// 1.1 导出一个函数，这个函数接收一个对象app
module.exports = app => {
    // 1.2 在这个对象里面就可以用最外层的app(如何去引用最外层的app，要在最外层的index.js里面加代码)

    const express = require('express')
    // 1.3 这里是express的一个子路由，当我们需要子路由的时候，就用它。
    const router = express.Router()
    // 1.6
    const User = require('../../models/User')  // !!!
    // 1.5 这里我们会涉及到把数据存进去，因此需要数据库
    router.post('/users', async (req, res) => {
        // 1.7 引入User后，继续把数据存进去（下面要想使用的话，需要添加await）
        const model = await User.create(req.body)// 定义一个model
        // 1.8 发回客户端，让它知道我们创建完成了，以及创建的数据是什么
        res.send(model)
    }) 
    // 1.4 将子路由挂载到这个地方，不然每次写路由都要加上/admin/api很麻烦
    app.use('/admin/api', router)
}