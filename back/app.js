const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
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
app.use(morgan('dev'));
app.use(
  cors({
    origin: 'http://localhost:3060',
    credentials: true,
  }),
); // 모든 요청에 대해서 cors 허용

// 경로를 자동으로 만들어줌 (운영체제에 따라서 자동으로)
// front에서는 back의 폴더 구조를 모른다 => 보안에 장점
// 실제 주소: /uploads/사진.png
// 숨겨진 주소: /사진.png
app.use('/', express.static(path.join(__dirname, 'uploads')));
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

app.use('/post', postRouter); // 라우터 분리!
app.use('/posts', postsRouter); // 게시물 로드용
app.use('/hashtag', hashtagRouter); // 게시물 로드용
app.use('/user', userRouter); // 라우터 분리!

// 에러처리 미들웨어 자리

app.listen(3065, () => {
  console.log('서버 실행 중');
});
