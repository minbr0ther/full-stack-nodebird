const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
  // 세션에 모든 것을 저장하기 에는 무겁기 때문에,
  // 유저 정보 중에서 쿠키랑 묶어줄 정보만 저장
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 저장해둔 아이디를 통해 다시 정보(pw, email)들 불러오기
  passport.deserializeUser(async (id, done) => {
    try {
      // db에서 id로 정보를 불러온다
      const user = await User.findOne({ where: { id } });
      done(null, user);
    } catch (err) {
      console.error(err);
      done(err);
    }
  });

  local();
};
