/**
 * @author khanhhn on 03/11/2019
 * @project jwt
 */
const {moongoose} = require('../database/database')
const {User} = require('../database/models/User')
const makeUserBecomeAdmin = async(userId) => {
    try {
        //Tìm user với id = userId và update trường "permission"
        let user = await User.findById(userId)
        if(!user) {
            console.log(`Không tìm thấy user với id = ${userId}`)
            return
        }
        user.permission = 2
        user.isBanned = 0
        user.active = 1
        await user.save()
        console.log(`Đã "phong" admin cho user: ${userId} + "--" + ${user.name}`)        
    } catch (error) {
        console.log(`Không thể update được user với userId=${userId}`)
    }
}
makeUserBecomeAdmin('5dbe96a529c25e4854ca480c')