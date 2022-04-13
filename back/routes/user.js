const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

// 브라우저 새로고침시마다 작동하는 코드
router.get('/', async (req, res, next) => {
  // GET /user 매번 사용자 정보 복구
  try {
    if (req.user) {
      // 기존이의 로그인과 동일하게 사용자의 모든 정보 load
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Post,
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followings',
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followers',
            attributes: ['id'],
          },
        ],
      });

      res.status(200).json(fullUserWithoutPassword);
    } else {
      // 정보가 없으면
      res.status(200).json(null);
    }
  } catch (err) {
    console.error(err);
    next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  // 미들 웨어 확장 😱 - 서버에러, 성공, 클라이언트 에러
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(error); // express가 에러처리하게 보내버림
    }
    if (info) {
      // client 에러, 401: 허가되지 않음(로그인)
      return res.status('401').send(info.reason);
    }

    return req.login(user, async (loginErr) => {
      if (loginErr) {
        // 에러날 일 없지만 혹시나
        console.error(loginErr);
        return next(loginErr);
      }

      // 비밀번호 빼고 모든 정보를 갖고 있는 user
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },

        // 원하는 정보만 가져온다 (비밀번호 제외)
        // attributes: ['id', 'nickname', 'email'],
        attributes: { exclude: ['password'] },

        // user에 저장할 추가 테이블 (작성한 게시물, 팔로잉, 팔로워)
        include: [
          {
            model: Post,
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followings',
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followers',
            attributes: ['id'],
          },
        ],
      });

      // 여기서 쿠키를 보내줌
      // ex) res.setHeader('Cookie', 'cxlhy')
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post('/', isNotLoggedIn, async (req, res, next) => {
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

router.post('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('ok');
});

module.exports = router;
