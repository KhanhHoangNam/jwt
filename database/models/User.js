const {mongoose} = require('../database')
const bcrypt = require('bcrypt')
const {Schema} = mongoose
const UserSchema = new Schema({
    //schema: cấu trúc của một collection
    name: {type: String, default: 'unknown', unique: true},    
    email: {type: String, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, unique: true},  
    password: {type: String, required: true},  
    active: {type: Number, default: 0}, //inactive
})

//Chuyển từ Schema sang Model
const User = mongoose.model('User', UserSchema)
const insertUser = async (name, email, password) => {
    try {
        //Mã hóa trước khi lưu vào DB
        const encryptedPassword = await bcrypt.hash(password, 10)
        const newUser = new User()
        newUser.name = name
        newUser.email = email
        newUser.password = encryptedPassword
        await newUser.save()
    } catch (error) {
        //Tùy biến lại error
        if(error.code === 11000) {
            throw "Tên hoặc email đã tồn tại"
        }
    }
}

module.exports = {
    User,
    insertUser
}