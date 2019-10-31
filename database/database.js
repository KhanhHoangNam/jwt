const mongoose = require('mongoose')
const {Schema} = mongoose //Kĩ thuật destructing trong JS
const {ObjectId} = Schema
//Kết nối cơ sở dữ liệu MongoDB
const connectDatabase = async () => {
    try {
        let uri = 'mongodb://khanhhn:123456@127.0.0.1:27018/fullstackNodejs2018'
        let options = {
            connectTimeoutMS: 10000,
            useNewUrlParser: true,
            useCreateIndex: true,
        }
        await mongoose.connect(uri, options)
        console.log('Connect Mongo Database sucessfully!')
    } catch (error) {
        console.log(`Cannot connect Mongo. Error: ${error}`)
    }
}
connectDatabase()
module.exports = {
    mongoose
}