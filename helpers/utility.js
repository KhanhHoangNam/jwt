const PORT = 3000
const nodemailer = require('nodemailer')
const sendEmail = async (receiverEmail, secretKey) => {	    
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "chienbinhbattu9xpro@gmail.com", 
                pass: "khanhproth95"
            }
        })
        let mailOptions = {
            from: '"Khanhhn Test" <chienbinhbattu9xpro@gmail.com>', //Email người gửi
            to: receiverEmail, 
            subject: 'Activate email',         
            html: `<h1>Please click here to activate your account:</h1>
                   http://${require('os').hostname()}:${PORT}/users/activateUser?secretKey=${secretKey}&email=${receiverEmail}` 
        }
        let info = await transporter.sendMail(mailOptions)
        console.log('Message sent: %s', info.messageId);
    } catch(error) {
        throw error
    }
}
module.exports = {
    sendEmail, 
    PORT   
}