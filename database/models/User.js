const {mongoose} = require('../database')
const {Schema} = mongoose
const bcrypt = require('bcrypt')
const {sendEmail} = require('../../helpers/utility')
const jwt = require('jsonwebtoken')
const ACTION_BLOCK_USER = "ACTION_BLOCK_USER" //Khóa tài khoản
const ACTION_DELETE_USER = "ACTION_DELETE_USER" //Xóa tài khoản
const {deleteBlogPostsByAuthor} = require('./BlogPost')
const secretString = "secret string"

const UserSchema = new Schema({
    //schema: cấu trúc của một collection
    name: {type: String, default: 'unknown', unique: true},    
    email: {type: String, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, unique: true},  
    password: {type: String, required: true},  
    active: {type: Number, default: 0}, //inactive
    permission: {type: Number, default: 0}, //0:user, 1: moderator, 2: admin
    isBanned: {type: Number, default: 0}, //1 = Bị khóa tài khoản
    //Trường tham chiếu
    blogPosts:[{type:mongoose.Schema.Types.ObjectId, ref: "BlogPost"}]
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
        if(foundUser.isBanned ===1) {
            throw "User đã bị khóa tài khoản, do vi phạm điều khoản"
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
        if(foundUser.isBanned ===1) {
            throw "User đã bị khóa tài khoản, do vi phạm điều khoản"
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
        } else {
            throw "Bạn nhập sai passoword"
        }
    } catch(error) {
        throw error
    }
}
//
const verifyJWT = async (tokenKey) => {
    try {
        let decodedJson = await jwt.verify(tokenKey, secretString)
        if(Date.now() / 1000 > decodedJson.exp) {
            throw "Token hết hạn, mời bạn login lại"
        }
        let foundUser = await User.findById(decodedJson.id)
        if(foundUser.isBanned === 1) {
            throw "User đã bị khóa tài khoản, do vi phạm điều khoản"
        }
        if(!foundUser) {
            throw "Không tìm thấy User với token này"
        }
        debugger
        return foundUser
    } catch (error) {
        throw error
    }
}
//Hàm dành riêng cho "admin"
const blockOrDeleteUsers = async(userIds, tokenKey, actionType) => {
    try {
        //Admin có thể xóa/khóa nhiều user một lúc
        let signedInUser = await verifyJWT(tokenKey)
        if(signedInUser.permission !== 2) {
            throw "Chỉ có tài khoản admin mới có chức năng này"
        }
        userIds.forEach(async userId => {
            let user = await User.findById(userId)
            if(!user) {
                return
            }
            //Xóa hay delete
            if(actionType === ACTION_BLOCK_USER) {
                user.isBanned = 1
                await user.save()
            } else if(actionType === ACTION_DELETE_USER) {
                //Gồm 2 bước:
                //1. Xóa các blogposts của user
                await deleteBlogPostsByAuthor(userId)
                //2. Xóa user        
                await User.findByIdAndDelete(userId)        
            }
        })
    } catch (error) {
        throw error
    }
}
module.exports = {
    User,
    insertUser,
    activateUser,
    loginUser,
    verifyJWT,
    blockOrDeleteUsers
}