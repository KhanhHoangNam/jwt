const{BlogPost} = require('../database/models/BlogPost')
const deleteBlogPostsByAuthor = async (authorId) => {
    try {
        await BlogPost.deleteMany({
            author: authorId
        })
    } catch (error) {
        throw error
    }
}
module.exports = {deleteBlogPostsByAuthor}