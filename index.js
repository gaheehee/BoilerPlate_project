// index.js는 백엔드의 시작점
const express = require('express')  // express module을 가져옴
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://dbgahee:loh5558@cluster0.oecku.mongodb.net/dbgahee?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {    
  res.send('Hello World! 하이루')
})  // /디렉토리(루트 디렉토리)에서 헬로 월드 실행

// ctrl + c -> 작업 종료, 서버 종료  

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)  //port 5000에서 이 앱 실행
})