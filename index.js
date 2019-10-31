/**
 * @author khanhhn on 31/10/2019
 * @version 1.0.0
 * @project jwt
 */
const express = require('express')
const app = express()
const PORT = 3000
//Nhúng middleware body-parser vào Express
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
//Tùy biến Router
const usersRouter = require('./routers/userRouter')
app.use('/users', usersRouter)
//Start Server
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
})