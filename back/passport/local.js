const passport = require('passport');

// 구조분해 할당으로 이름 변경
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          // 일치하는 이메일 같은 것이 있는지 검사
          const user = await User.findOne({
            where: { email },
          });

          if (!user) {
            // 서버에러, 성공, 클라이언트 에러(보내는 측에서 잘못함)
            return done(null, false, { reason: '존재하지 않는 사용자입니다!' });
          }

          // db에 저장한 pw와 사용자가 입력한 pw가 일치하는지
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            // 성공 자리에 사용자 정보를 넘겨준다
            return done(null, user);
          }

          // 비밀번호가 일치하지 않음
          return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
        } catch (err) {
          console.error(err);
          return done(error);
        }
      },
    ),
  );
};
