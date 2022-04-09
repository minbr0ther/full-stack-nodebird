const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    // User테이블에서 동일한 email이 있는지 검색
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (exUser) {
      // 응답을 2번 보내지 않도록 return 해준다
      // 403은 금지의 의미를 갖는다
      return res.status(403).send('이미 사용중인 아이디입니다.');
    }

    // 두번째 인자로 10~13 사이 숫자를 넣어줌 => 높을수록 보안 쎄짐
    // 숫자를 높게 하면 좀더 보안성이 올라가지만 서버에 부하를 줄 수 있다.
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // table안에 데이터를 넣는 동작
    await User.create({
      email: req.body.email, // data.email
      nickname: req.body.nickname,
      password: hashedPassword,
    });

    // npm i cors로 대체 😂
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3060');

    res.status(201).send('ok');
  } catch (err) {
    console.error(err);
    next(err); // express가 error을 front한테 알려줌
  }
});

module.exports = router;
