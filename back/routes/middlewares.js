exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    // next의 인자로 무엇을 넣으면 에러처리하러 감
    next(); // 아무것도 넣지 않으면 다음 미들웨어로 감
  } else {
    res.status(401).send('로그인이 필요합니다.');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // next의 인자로 무엇을 넣으면 에러처리하러 감
    next(); // 아무것도 넣지 않으면 다음 미들웨어로 감
  } else {
    res.status(401).send('로그인이 필요합니다.');
  }
};
