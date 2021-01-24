// index.js는 백엔드의 시작점
// 서버 만들기
const express = require('express')  // express module을 가져옴
const app = express()
const port = 5000
const  config = require('./config/key');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const{ auth } = require('./middleware/auth');
const{ User } = require("./models/User");

//application/x-www-form-urlencoded처럼 생긴 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.urlencoded({extended: true}));
//application/json타입으로 된 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {    
  res.send('Hello World! what a nice day:)')
})  // /디렉토리(루트 디렉토리)에서 헬로 월드 실행

app.get('/api/hello', (req,res) => {
  res.send("안녕하세요~")
})

// 회원가입을 위한  register router
app.post('/api/users/register',(req,res) => {
    // 회원갑입 할 때 필요한 정보들을 client에서 가져오면 그것들을 데이터 베이스에 넣어줌
    const user = new User(req.body)
    // 정보들이 user에 저장됨
    user.save((err, userInfo) => {
        if(err) return res.json({ succecc: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {
  // 요청된 이메일을 데베에서 있는지 찾기
  User.findOne({email: req.body.email}, (err,user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 요청된 이메일이 데베에 있다면, 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) 
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})

      // 비밀번호가 맞다면, 토큰 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        
        // token을 저장(쿠키, 로컬스토리지 등에 저장가능)-> 쿠키
        res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id })

      })
    })
  })
})

// Auth router
// 여기까지 왔다는 것은 미들웨어 통과했다는 것임 -> Authentication이 true라는 뜻임
app.get('/api/users/auth', auth , (req, res) => {

  // 이렇게 정보를 주면 어떤 페이지든지 유저 정보를 사용할 수 있어서 편해짐
  res.status(200).json({
    _id: req.user._id,
    // role 0 -> 일반 user, role 0이 아니면 -> 관리자
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })

})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, 
   { token: ""}
   , (err, user) => {
     if(err) return res.json({ success: false, err });
     return res.status(200).send({
       success: true
     })
   })
})

// ctrl + c -> 작업 종료, 서버 종료  

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)  //port 5000에서 이 앱 실행
})