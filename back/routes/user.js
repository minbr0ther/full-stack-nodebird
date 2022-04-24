const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/:userId', async (req, res, next) => {
  // GET /user/1
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
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
    if (fullUserWithoutPassword) {
      // sequelize에서 보준 데이터는 json이 아님
      // sequelize로 작성된 것을 우리가 편집할 수 있도록 변경
      const data = fullUserWithoutPassword.toJSON();
      data.Posts = data.Posts.length;
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;
      // 개인정보 침해 예방
      res.status(200).json(data);
    } else {
      res.status(404).json('존재하지 않는 사용자입니다.');
    }
  } catch (err) {
    console.error(err);
    next(error);
  }
});

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

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      },
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(err);
    next(err);
  }
});

router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
  // PATCH /user/1/follow
  try {
    // 먼저 유저가 있는지 알아본다
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send('유령을 팔로우하려고 하시네요?');
    }
    // ORM이 복수인애들은 단수로 만들어줌 (복수로 하면 무조건 됨, 단수로 하면 제로초도 확신이 없음)
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(err);
    next(err);
  }
});

router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
  // DELETE /follower/1
  try {
    // 먼저 유저가 있는지 알아본다
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send('유령을 차단하려고 하시네요?');
    }
    // 그 사람이 나를 끊는다 = 내가 그 사람을 차단한다 (대칭관계)
    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(err);
    next(err);
  }
});

router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
  // DELETE /user/1/follow
  try {
    // 먼저 유저가 있는지 알아본다
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send('유령을 언팔로우하려고 하시네요?');
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(err);
    next(err);
  }
});

router.get('/followers', isLoggedIn, async (req, res, next) => {
  // GET /user/followers
  try {
    // 본인을 먼저 찾아본다
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(403).send('본인은 유령이신가요?');
    }
    const followers = await user.getFollowers();
    res.status(200).json(followers);
  } catch (error) {
    console.error(err);
    next(err);
  }
});

router.get('/followings', isLoggedIn, async (req, res, next) => {
  // GET /user/followings
  try {
    // 본인을 먼저 찾아본다
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(403).send('본인은 유령이신가요?');
    }
    const followings = await user.getFollowings();
    res.status(200).json(followings);
  } catch (error) {
    console.error(err);
    next(err);
  }
});

router.post('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('ok');
});

module.exports = router;
