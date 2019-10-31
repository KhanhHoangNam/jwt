const express = require('express')
const router = express.Router()
const {insertUser} = require('../database/models/User')

router.use((req, res, next) => {
    console.log('Time: ', Date.now()) //Time log
    next()
})
router.post('/registerUser', async (req, res) => {
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
module.exports = router