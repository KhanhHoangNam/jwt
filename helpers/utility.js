const PORT = 3000
const nodemailder = require('nodemailer')
const sendEmail = async (receiverEmail, secretKey) => {
    try {
        let transporter = nodemailder.createTransport({
            service: 'gmail',
            auth: {
                user: "chienbinhbattu9xpro@gmail.com",
                pass: "khanhproth95"
            }
        })
    
        let mailOptions = {
            from: '"Khanhn Test" <chienbinhbattu9xpro@gmail.com>',
            to: receiverEmail,
            subject: 'Activate mail',
            html: `<h1>Please click here to activate your account:</h1>
                   http://${require('os').hostname()}:${PORT}/users/activateUser?secretKey=${secretKey}&email=${receiverEmail}`
        }
        let info = await transporter.sendMail(mailOptions)
        console.log('Message sent: %s', info.messageId)
    } catch (error) {
        throw error
    }
}

module.exports = {
    sendEmail,
    PORT
}