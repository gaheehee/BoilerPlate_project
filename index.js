// index.js는 백엔드의 시작점
// 서버 만들기
const express = require('express')  // express module을 가져옴
const app = express()
const port = 5000

const  config = require('./config/key');

const bodyParser = require('body-parser');
const{ User } = require("./models/User");

//application/x-www-form-urlencoded처럼 생긴 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.urlencoded({extended: true}));
//application/json타입으로 된 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {    
  res.send('Hello World! what a nice day:)')
})  // /디렉토리(루트 디렉토리)에서 헬로 월드 실행

// 회원가입을 위한 router
app.post('/register',(req,res) => {
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

// ctrl + c -> 작업 종료, 서버 종료  

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)  //port 5000에서 이 앱 실행
})