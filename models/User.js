const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,     // space바, 빈칸 없애주는 역할
        unique: 1       // 중복 이메일 못 쓰게
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {        // 유효성 관리 시 사용
        type: String
    },
    tokenExp: {     // 토큰 사용 유효기간
        type: Number
    }

})

const User = mongoose.model('Usser', userSchema)

module.exports = {User}     // 다른 곳에서도 쓸 수 있게 export해줌