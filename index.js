/**
 * @author khanhhn on 31/10/2019
 * @version 1.0.0
 * @project jwt
 */
const express = require('express')
const app = express()
const {PORT} = require('./helpers/utility')
//Nhúng middleware body-parser vào Express
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
//Tùy biến Router
const usersRouter = require('./routers/userRouter')
const blogPostRouter = require('./routers/blogPostRouter')
app.use('/users', usersRouter)
app.use('/blogPosts', blogPostRouter)
//Start Server
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
})