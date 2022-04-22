const moogose = require('mongoose')

// 导出再建立一个schema,用它去定义模型的字段有哪些
const schema = new moogose.Schema({
    username: {
        type: String
    },
    password: {
        type: String,
        // select: false,  // 4. 加了这个之后，密码都是查不出来的 select: false的意思是默认查询的时候不要带有这个数据

        /* 【管理员账号管理】1. set表示的是我们填什么它就保存什么，但是set它是一个函数，
        我们可以自定义要怎么修改、保存，就是把这个值改一下，再保存。 */

        // 2. 这里的set简写。接收一个用户本来填的值val
        // set: function () {
        set(val) {
            /* ！！！（下面会忘记）3. 在这里做一个散列，散列需要用到一个模块bcrypt（server端），用于做密码的散列(npm i bcryptjs)
            安装完之后就可以用require，hashSync散列是个同步方法，因为我们需要等到它返回值，默认是个异步方法。
            hashSync里的第一个参数是散列的值，第二个参数是散列的指数，指数越高越安全，但是越耗时，一般10-12比较合理一点
            这个的安全性是有保证的，因为bcryptjs的散列是不可逆的散列，而且针对同一个值123456来散列，
            每一次生成不一样的值。这个比md5加密，甚至说是之前添加盐值的加密（随机字符串的加密），还要安全 
            同一个字符也不能找到映射关系，建议大家都用bcrypt做密码的散列。 */
            return require('bcryptjs').hashSync(val, 10)
        }
    },
    password_d: {
        type: String,
        default: "******"
    },
    icon: {
        type: String,
        default: "iconfont icon-eye-none"
    },
    email: {
        type: String
    }
})

// 导出mongoose.model (弹幕：实例这个user并导出)  ！！！！
module.exports = moogose.model('User', schema)