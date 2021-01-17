const { User } = require("../models/User");

const { User } = require('../models/User');

let auth = (req, res, next) => {
    // 인증처리를 하는 곳

    // client cookie에서 토큰을 가져옴
    let token = req.cookies.x_auth;
    // 토큰을 복호화 한 후 user 찾기
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })

        // 유저가 있으면
        req.token = token;
        req.user = user;
        next();
    })
}

module.exports = {auth};