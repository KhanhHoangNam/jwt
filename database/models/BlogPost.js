/**
 * @author khanhhn on 02/11
 * BlogPost model
 */
const {mongoose} = require('../database')
const {Schema} = mongoose
//Quan hệ 1 User -n BlogPost
//Một user thêm mới bài viết:
//User phải đăng nhập(hoặc có tokenKey)
const BlogPostSchema = new Schema({
    title: {type: String, default: "Haha", unique: true},
    content: {type: String, default: ""},
    date: {type: Date, default: Date.now()},
    //Trường tham chiếu, 1 blogpost do 1 người viết
    author:{type: mongoose.Schema.Types.ObjectId, ref: "User"}
})
//Quan hệ 1 User -n BlogPost
const BlogPost = mongoose.model('BlogPost', BlogPostSchema)
module.exports = { BlogPost }