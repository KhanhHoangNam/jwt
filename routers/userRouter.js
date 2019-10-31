const express = require('express')
const router = express.Router()
const {insertUser, activateUser} = require('../database/models/User')

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
module.exports = router