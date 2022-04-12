const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');

const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');
const passportConfig = require('./passport');

dotenv.config(); // dotenv 활성화
const app = express();

// sequelize에 연결
db.sequelize
  .sync() // Promise
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

passportConfig();

// use의 뜻 => express 서버에 '미들웨어'를 장착
// 🚨 약간 import 느낌이라 상단에 적어주는게 좋음
app.use(cors()); // 모든 요청에 대해서 cors 허용
// json => json형식을 req.body에 넣어주는 역할
app.use(express.json());
// urlencoded => (보통 form data) req.body에 넣어주는 역할
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    // 딱히 tru로 쓸 필요 없음
    saveUninitialized: false,
    resave: false,
    // 이것을 해킹 당하면 해시를 복원할 수 있다 (위험)
    // 쿠키에 랜덤한 문자열을 보내줄때 사용하는 것
    secret: process.env.COOKIE_SECRET,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

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
