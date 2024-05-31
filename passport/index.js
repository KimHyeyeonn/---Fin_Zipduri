const passport = require('passport');
const localStrategy = require('./localStrategy');
const kakaoStrategy = require('./kakaoStrategy');
const User = require('../models/user');

// 사용자 직렬화
passport.serializeUser((user, done) => {
  console.info('___passport.serializeUser()');
  done(null, user.id);
});

// 사용자 역직렬화
passport.deserializeUser((id, done) => {
  console.info('___passport.deserializeUser()');
  User.findOne({ where: { id } })
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

// 로컬 전략 사용
passport.use(localStrategy);

// 카카오 전략 사용
passport.use(kakaoStrategy);

module.exports = passport;
