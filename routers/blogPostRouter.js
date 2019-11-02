/**
 * @author khanhhn on 02/11/2019
 * Routers for "BlogPost" collection
 */
const express = require('express')
const router = express.Router()
const {
    insertBlogPost,
    queryBlogPosts,
    queryBlogPostsByDateRange
} = require('../database/models/BlogPost')
router.use((req, res, next) => {
    console.log('Time: ', Date.now()) //Timelog
    next()
})
router.post('/insertBlogPost', async (req, res) => {
    let {title, content} = req.body
    //Client phải gửi tokenKey
    let tokenKey = req.headers['x-access-token']
    try {
        let newBlogPost = await insertBlogPost(title, content, tokenKey)
        res.json({
            result: "success",
            message: "Thêm mới blogPost thành công",
            data: newBlogPost
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Không thể thêm mới BlogPost. Lỗi: ${error}`
        })
    }
})
router.get('/queryBlogPosts', async(req, res) => {
    let {text} = req.query
    try {
        let blogPosts = await queryBlogPosts(text)
        res.json({
            result: "success",
            message: "Query thành công danh sách BlogPost",
            data: blogPosts
        })
    } catch (error) {
        res.json({
            result: "failed",
            message: `Không thể lấy được danh sách blogPosts. Lỗi: ${error}`,            
        })
    }
})
//
router.get('/queryBlogPostsByDateRange', async(req, res) => {
    let {from, to} = req.query
    try {
        let blogPosts = await queryBlogPostsByDateRange(from, to)
        res.json({
            result: "success",
            message: "Query thành công danh sách BlogPost",
            data: blogPosts
        })
    } catch (error) {
        res.json({
            result: "failed",
            message: `Không thể lấy được danh sách blogPosts. Lỗi: ${error}`,            
        })
    }
})
module.exports = router