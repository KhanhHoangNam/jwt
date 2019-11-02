/**
 * @author khanhhn on 02/11
 * BlogPost model
 */
const {mongoose} = require('../database')
const {Schema} = mongoose
const {verifyJWT} = require('./User')
const BlogPostSchema = new Schema({
    title: {type: String, default: "Haha", unique: true},
    content: {type: String, default: ""},
    date: {type: Date, default: Date.now()},
    //Trường tham chiếu, 1 blogpost do 1 người viết
    author:{type: mongoose.Schema.Types.ObjectId, ref: "User"}
})
//Quan hệ 1 User -n BlogPost
const BlogPost = mongoose.model('BlogPost', BlogPostSchema)
//Một user thêm mới bài viết:
//User phải đăng nhập(hoặc có tokenKey)
const insertBlogPost = async(title, content, tokenKey) => {
    try {
        //Kiểm tra đăng nhập = có tokenKey "còn hạn" không?
        let signedInUser = await verifyJWT(tokenKey)
        let newBlogPost = await BlogPost.create({
            title, content,
            date: Date.now(),
            author: signedInUser
        })
        await newBlogPost.save()
        signedInUser.blogPosts.push(newBlogPost)
        await signedInUser.save()
        return newBlogPost
    } catch (error) {
        throw error
    }
}
//Muốn xem danh sách các blogpost => không cần token
//Vì ai cũng thế xem được
const queryBlogPosts = async (text) => {
    try {        
        let blogPosts = await BlogPost.find({
            $or: [
                {
                    title: new RegExp(text, "i")
                    //i => ko phân biệt hoa/thường
                },
                {
                    content: new RegExp(text, "i")
                }
            ],                   
        })
        return blogPosts
    } catch(error) {        
        throw error
    }
}
//Lấy các bài viết post trong khoảng ngày A => ngày B
const queryBlogPostsByDateRange = async (from, to) => {
    //format: dd--mm--yyyy
    let fromDate = new Date(parseInt(from.split('-')[2]),
                            parseInt(from.split('-')[1])-1,
                            parseInt(from.split('-')[0]))
    let toDate = new Date(parseInt(to.split('-')[2]),
                          parseInt(to.split('-')[1])-1,
                          parseInt(to.split('-')[0]))      
    try {
        let blogPosts = await BlogPost.find({
            date: {$gte: fromDate, $lte: toDate}
        })
        return blogPosts
    } catch (error) {
        throw error
    }                                             
}
module.exports = {
    BlogPost,
    insertBlogPost,
    queryBlogPosts,
    queryBlogPostsByDateRange
}