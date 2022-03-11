// 1.1 导出一个函数，这个函数接收一个对象app
module.exports = app => {
    // 1.2 在这个对象里面就可以用最外层的app(如何去引用最外层的app，要在最外层的index.js里面加代码)

    const express = require('express')
    // 1.3 这里是express的一个子路由，当我们需要子路由的时候，就用它。
    const router = express.Router()
    // 1.6
    const User = require('../../models/User')  // !!!
    // 1.5 这里我们会涉及到把数据存进去，因此需要数据库

    // 添加用户
    router.post('/users', async (req, res) => {
        // 1.7 引入User后，继续把数据存进去（下面要想使用的话，需要添加await）
        const model = await User.create(req.body)// 定义一个model
        // 1.8 发回客户端，让它知道我们创建完成了，以及创建的数据是什么
        res.send(model)
    })
    
    // 获取用户列表
    router.get('/users', async (req, res) => {
        const items = await User.find().limit(10)  // !!!
        res.send(items)
    })

    // 获取当前编辑的数据到表单中
    router.get('/users/:id', async (req, res) => {
        const model = await User.findById(req.params.id)
        res.send(model)
    })
    
    // 编辑用户
    router.put('/users/:id', async (req, res) => {
        const model = await User.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })

    // 删除用户
    router.delete('/users/:id', async (req, res) => {
        await User.findByIdAndDelete(req.params.id, req.body)
        res.send({
            success: true
        })
    })
    // 1.4 将子路由挂载到这个地方，不然每次写路由都要加上/admin/api很麻烦
    app.use('/admin/api', router)
}