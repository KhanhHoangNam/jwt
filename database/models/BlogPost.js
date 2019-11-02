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
//Lấy nội dung chi tiết 1 BlogPost => Không cần token
const getDetailBlogPost = async (blogPostId) => {
    let blogPost = await BlogPost.findById(blogPostId)
    try {
        if(!blogPost) {
            throw `Không tìm thấy blogpost với Id=${blogPostId}`
        }
        return blogPost
    } catch (error) {
        throw error
    }
}
//Cập nhật 1 blogpost => yêu cầu token
//Chỉ có tác giả mới cập nhật được BlogPost của mình
const updateBlogPost = async(blogPostId, updatedBlogPost, tokenKey) => {
    try {
        let signedInUser = await verifyJWT(tokenKey)
        let blogPost = await BlogPost.findById(blogPostId)
        try {
            if(!blogPost) {
                throw `Không tìm thấy blogpost với Id=${blogPostId}`
            }
            if(signedInUser.id !== blogPost.author.toString()) {
                throw "Không update được vì bạn không phải là tác giả bài viết"
            }
            blogPost.title = !updatedBlogPost.title ? blogPost.title : updatedBlogPost.title
            blogPost.content = !updatedBlogPost.content ? blogPost.content : updatedBlogPost.content
            blogPost.date = Date.now()
            await blogPost.save()
            return blogPost
        } catch (error) {
            throw error
        }
    } catch (error) {
        throw error
    }
}
//Xóa 1 bản ghi blogPost:
//1. Xóa bản ghi trong bảng BlogPosts
//2. Cập nhật trường tham chiếu "blogPosts" trong bảng Users
//=> Mảng bớt đi một phần tử
const deleteBlogPost = async(blogPostId, tokenKey) =>{
    try {
        let signedInUser = await verifyJWT(tokenKey)
        let blogPost = await BlogPost.findById(blogPostId)
        try {
            if(!blogPost) {
                throw `Không tìm thấy blogpost với Id=${blogPostId}`
            }
            if(signedInUser.id !== blogPost.author.toString()) {
                throw "Không xóa được vì bạn không phải là tác giả bài viết"
            }
            await BlogPost.deleteOne({_id: blogPostId})
            signedInUser.blogPosts = await signedInUser.blogPosts.filter(
                eachBlogPost => {
                    return blogPost._id.toString() !== eachBlogPost._id.toString()
                }
            )
            await signedInUser.save()
        } catch (error) {
            throw error
        }
    } catch (error) {
        throw error
    }
}
module.exports = {
    BlogPost,
    insertBlogPost,
    queryBlogPosts,
    queryBlogPostsByDateRange,
    getDetailBlogPost,
    updateBlogPost,
    deleteBlogPost
}