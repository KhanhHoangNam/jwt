const {mongoose} = require('../database')
const {Schema} = mongoose

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
module.exports = {
    User
}