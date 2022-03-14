// 1.1 导出一个函数，这个函数接收一个对象app
module.exports = app => {
    // 1.2 在这个对象里面就可以用最外层的app(如何去引用最外层的app，要在最外层的index.js里面加代码)

    const express = require('express')
    // 1.3 这里是express的一个子路由，当我们需要子路由的时候，就用它。
    const router = express.Router()
    // 1.6
    const User = require('../../models/User') // !!!
    // 1.5 这里我们会涉及到把数据存进去，因此需要数据库

    // 添加用户
    router.post('/users', async (req, res) => {
        // 1.7 引入User后，继续把数据存进去（下面要想使用的话，需要添加await）
        const model = await User.create(req.body) // 定义一个model
        // 1.8 发回客户端，让它知道我们创建完成了，以及创建的数据是什么
        res.send(model)
    })

    // 获取用户列表
    router.get('/users', async (req, res) => {
        const items = await User.find().limit(10) // !!!
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

    // 查找用户
    router.get('/user/:username', async (req, res) => {
        var username = req.params.username;
        // 正则匹配 i忽略大小写
        var reg = new RegExp(username, "i")
        const model = await User.find({
            username: {
                $regex: reg
            }
        })
        res.send(model)
    })

    // 登录接口
    app.post('/admin/api/login', async (req, res) => {

        /* 1. 我们应该是在前端把用户名和密码传过来，然后在这里校验，最终得到一些数据，看看是否成功。
        返回前端一个token，一串密钥，让它去保存这个密钥。后续通过这个密钥去证明自己是哪个用户。 */
        // res.send('ok') // 跑通接口

        /* 2. 到了服务器这边，无非是把数据接收过来，然后在数据库进行查找。
        首先定义一个解构赋值 req.body就表示客户端传过来的所有数据(一个对象，有username，有password)
        我们把里面的username和password分别解构出来。这样操作比较简单，
        否则你就定义一个data = req.body，username = data.username。因为解构赋值比较简单一点，直接取对象里的username和password。 */
        const {
            username,
            password
        } = req.body

        /* 3. 拿到这两个东西后，我们应该想如何去操作。
        一定要分清楚，我们没办法通过用户名和密码直接去找用户，只能根据用户名去找，因为密码被散列，被加密了，已经被换成密文了。
        所以通过明文的123456找密文是找不到的，而且如果你把明文的123456用brcypt散列一下，再去查找，也是找不到的，
        因为每一次的散列都会生成新的hash。因此我们只能一步步来，先通过username找到这个用户。*/

        const User = require('../../models/User')
        /* 3.1 根据用户名找用户。
        下面是username: username键值对简写的方式，它们两正好一致，我们就可以写成简写方式。 */
        const user = await User.findOne({
            username
        }).select('+password') // 这里加上select的意思是把password取出来，因为默认是不取它的，我们要用加号，要取它

        if (!user) {
            /* ！！！ 设置状态码，并发送一段数据。平时我们是直接res.send发送，下面的写法表示的是适龄状态码再发送，
            这样客户端至少知道不是正常的200，不是一个普通正常的请求。（这里去查看network，发现状态码422，返回用户名不存在） */
            return res.status(422).send({
                message: '用户不存在' // 有了这个消息，前端就能把它显示出来（去http里全局捕获）
            })
        }


        /* 3.2 校验密码
        如果用户存在，就去校验密码；如果不存在，就抛出异常来。
        引入bcrypt加密密码的模块  compareSync比较明文和密文是否匹配。 */
        const isValid = require('bcryptjs').compareSync(password, user.password) // 因此之前在模型里设置了select: false，因此默认是取不到值的。
        if (!isValid) {
            // 统一422表示客户端提交的数据有问题，验证错误，当然你也可以用400或者别的，只不过老师习惯用422。在resForm规范里，也有建议用422的
            return res.status(422).send({
                message: '密码错误'
            })
        }


        // 3.3 返回token
        // 返回token，我们需要用到一个jsonwebtoken，在服务端里进行安装。这个是现在比较流行的，做web token验证的
        const jwt = require('jsonwebtoken')
        /* ！！！（少了前面的const token）用sign(签名)来生成一个token。接收参数，第一个payload——你要放到token里的数据
        （这个token不是简单的随机字符串，它是把一个数据拿来进行散列，最后生成一个字符串拿去给客户端使用）
        这里用一个对象比较好一点，我们只要保存用户的唯一id就够了，或者把用户的个人信息也保存进去，比如用户名是什么。 */
        const token = jwt.sign({
                id: user._id
                /* 不过大多数情况下，我们并不需要用户名，因为用户的用户名一般都是拿到id后自己把它获取出来的。
                只是说在jwt.sign里面可以加任何类型的数据。 */
                // username: user.username  我们这里为了简单只放一个数据
            },

            /* 它还有第二个参数，很重要，secret是个密钥，这个表示在生成token的时候，我们给它一个密钥。
            给了这个密钥之后，它就会根据一定的算法去生成token，生成完后，客户端是可以不需要密钥把数据解出来，
            但是一旦要验证是否正确（是否被客户端篡改过），我们就必要用另外一个成对的方法jwt.sign对应的jwt.verify去校验
            所以这就需要服务端给一个密钥，哪怕客户端篡改了这个信息，那服务端也能识别出来这个是无效的
            这个密钥随便给它一个字符串就可以。但是不能直接写在这里，它应该是一个全局的东西，所以下面涉及到给全局加一个属性（index.js） */
            // 这个get只能获取一个参数，它与我们定义路由的get名字其实是冲突的，所以这里通过参数名来区别，你是在定义路由还是配置。
            app.set('secret')
        )

        // ！！！（少了这一步）当然这里还可以返回用户名，客户端就可以提示一下（这里老师直接在console里输出了token）
        res.send({
            token
        })
        // 4. 然后去前端把token保存下来

    })
    // 1.4 将子路由挂载到这个地方，不然每次写路由都要加上/admin/api很麻烦
    app.use('/admin/api', router)
}