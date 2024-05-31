// 로그인

// isLoggedIn 함수
// 현재 로그인된 상태인지 확인하는 미들웨어 함수입니다.
// 로그인된 상태이면 다음 미들웨어로 연결합니다.
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

// isNotLoggedIn 함수
// 현재 로그인되지 않은 상태인지 확인하는 미들웨어 함수입니다.
// 로그인 안된 상태이면 다음 미들웨어로 연결합니다.
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent('로그인한 상태입니다.');
    res.redirect(`/?error=${message}`);
  }
};
