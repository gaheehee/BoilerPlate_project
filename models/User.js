const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

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

userSchema.pre('save', function(next){ 
    var user = this;

    // password가 변했을 때에만 
    if(user.isModified('password')){

        // 비밀번호 암호화 
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                // next로 돌아가기
                next()
            })
        })
    } else{
        next()
    }
})

// plain비번이랑 암호화 비번이랑 같은지 확인
userSchema.methods.comparePassword =  function(plainPassword, cb){

    bcrypt.compare(plainPassword, this.password, function(err, isMatch){

        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema. methods.generateToken = function(cb){
    var user = this;

    // jsonwebtoken을 이용해서 토큰 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user) 
    })
}

userSchema.statics.findByTOken = function( token, cb){
    var user = this;

    // 토큰을 decode(복호화)함
    jwt.verify(token, 'secretToken', function(err, decoded){
        // 유저 아이디를 이용하여 유저를 찾은 후
        // 클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인
        user. findOne({ "_id": decoded, "token": token }, function(err, user ){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = {User}     // 다른 곳에서도 쓸 수 있게 export해줌