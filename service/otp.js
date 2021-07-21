const email = require("../service/email")


const createOtp = ()=>{
    return Math.floor(100000 + Math.random()*900000);
}

const sendOtp= (otpTo, otp)=>{
    let text = 'Your otp is ' + otp + '. Please do not share it with anyone. Thank you !'; 
    let subject = 'OTP node.js';
    return email.sendEmail(subject, text);
}



module.exports = {createOtp, sendOtp};