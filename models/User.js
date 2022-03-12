const moogose = require('mongoose')

// 导出再建立一个schema,用它去定义模型的字段有哪些
const schema = new moogose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    password_d: {
        type: String,
        default: "******"
    },
    icon: {
        type: String,
        default: "iconfont icon-eye-none"
    }
})

// 导出mongoose.model (弹幕：实例这个user并导出)  ！！！！
module.exports = moogose.model('User', schema)