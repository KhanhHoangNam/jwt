const express = require('express')
const router = express.Router()
const {insertUser,
       activateUser,
       loginUser,
       verifyJWT,
       blockOrDeleteUsers
    } = require('../services/UserService')

router.use((req, res, next) => {
    console.log('Time: ', Date.now()) //Time log
    next()
})
router.post('/registerUser', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    let {name, email, password} = req.body //Phần validate trường chúng ta sẽ học ở bài khác
    try {
        await insertUser(name, email, password)
        res.json({
            result: "success",
            message: "Đăng kí user thành công, bạn cần mở email để kích hoạt"
        })
    } catch (error) {
        res.json({
            result: "failed",
            message: `Không thể đăng kí thêm user. Lỗi: ${error}`
        })
    }
})
//
router.get('/activateUser', async(req, res) => {
    let {email, secretKey} = req.query
    try {
        await activateUser(email, secretKey)
        res.send(`<h1 style="color:MediumSeaGreen;">Kích hoạt User thành công</h1>`)
        
    } catch (error) {
        res.send(`<h1 style="color:Red;">Không kích hoạt được User. Lỗi: ${error}</h1>`)
    }
})
//
router.post('/loginUser', async(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    let {email, password} = req.body
    try {
        let data = await loginUser(email, password)    
        res.json({
            result: "success",
            message: "Đăng nhập thành công",        
            data
        })             
    } catch (error) {
        res.json({
            result: "failed",
            message: `Đăng nhập không thành công. Lỗi ${error}`
        })
    }
})
//
router.get('/jwtTest', async(req, res) => {
    let tokenKey = req.headers['x-access-token']
    try {
        //Verify token
        await verifyJWT(tokenKey)
        res.json({
            result: 'sucess',
            message: 'Verify Json Web Token thành công'
        })
    } catch (error) {
        res.json({
            result: "failed",
            message: `Lỗi kiểm tra token. Lỗi ${error}`
        })
    }
})
//blockOrDeleteUsers
router.post('/admin/blockOrDeleteUsers', async (req, res) => {
    let tokenKey = req.headers['x-access-token']
    let {userIds, actionType} = req.body
    userIds = userIds.split(',') //Biến string thành array
    try {
        await blockOrDeleteUsers(userIds, tokenKey, actionType)
        res.json({
            result: "success",
            message: "Block/delete user thành công"
        })
    } catch (error) {
        res.json({
            result: "failed",
            message: `Lỗi block/delete user. Error: ${error}`
        })
    }
})
module.exports = router