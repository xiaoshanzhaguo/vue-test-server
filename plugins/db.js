// 数据库插件的写法就写好啦  module.exports导出一个函数，接收一个参数app
// eslint-disable-next-line no-unused-vars
module.exports = app => {
    const moogose = require('mongoose')
    // moogose去连接mongodb
    moogose.connect('mongodb://127.0.0.1:27017/test', { // !!!
        // 这里是连接的参数
        useNewUrlParser: true
    })
}