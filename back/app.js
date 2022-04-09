const express = require('express');
const cors = require('cors');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');
const app = express();

// sequelize에 연결
db.sequelize
  .sync() // Promise
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

app.use(cors()); // 모든 요청에 대해서 cors 허용
// use의 뜻 => express 서버에 '미들웨어'를 장착
// json => json형식을 req.body에 넣어주는 역할
// urlencoded => (보통 form data) req.body에 넣어주는 역할
// 🚨 약간 import 느낌이라 상단에 적어주는게 좋음
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('hello express');
});

app.get('/api', (req, res) => {
  res.send('hello api');
});

app.get('/api/posts', (req, res) => {
  res.json([
    { id: 1, content: 'hello' },
    { id: 1, content: 'hello' },
    { id: 1, content: 'hello' },
  ]);
});

app.use('/post', postRouter); // 라우터 분리!
app.use('/user', userRouter); // 라우터 분리!

app.listen(3065, () => {
  console.log('서버 실행 중');
});
