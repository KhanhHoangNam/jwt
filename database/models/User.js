const {mongoose} = require('../database')
const bcrypt = require('bcrypt')
const {sendEmail} = require('../../helpers/utility')
const jwt = require('jsonwebtoken')
const secretString = "secret string"
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
        await sendEmail(email, encryptedPassword)
    } catch (error) {
        //Tùy biến lại error
        if(error.code === 11000) {
            throw "Tên hoặc email đã tồn tại"
        }
    }
}
//
const activateUser = async (email, secretKey) => {
    try {
        let foundUser = await User.findOne({
            email, password: secretKey
        }).exec()
        if(!foundUser) {
            throw "Không tìm thấy User để kích hoạt"
        }
        if(foundUser.active === 0) {
            foundUser.active = 1
            await foundUser.save()
        } else {
            throw "User đã kích hoạt"
        }
    } catch (error) {
        throw error
    }
}
//Viết hàm login User
const loginUser = async (email, password) => {
    try {
        let foundUser = await User.findOne({email: email.trim()})
                            .exec()
        if(!foundUser) {
            throw "User không tồn tại"
        }
        if(foundUser.active === 0) {
            throw "User chưa kích hoạt, bạn phải mở mail kích hoạt trước"               
        }
        let encryptedPassword = foundUser.password
        let checkPassword = await bcrypt.compare(password, encryptedPassword)
        if (checkPassword === true) {
            //Đăng nhập thành công
            let jsonObject = {
                id: foundUser._id
            }

            let tokenKey = await jwt.sign(jsonObject, 
                                secretString, {
                                expiresIn: 86400 // Expire trong 24 giờ
                                })
            return tokenKey
        }
    } catch(error) {
        throw error
    }
}
module.exports = {
    User,
    insertUser,
    activateUser,
    loginUser
}