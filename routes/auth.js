/* 로그인 기능들 구현 */

const express = require('express');
const passport = require('../passport/index');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');

/*
  session이 있을 때 집으로 이동
  session이 없을 때 로그인 화면
*/
router.get('/', (req, res) => {
  if (req.user) {
    res.redirect(`/guestBook`);
  } else {
    res.redirect('/login');
  }
});

/* 로그인 화면 이동 */
router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('../views/login/login.html');
});

/* Passport Login */
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    req.session.user = { username: 'aaa' };

    res.redirect('/guestBook');
  }
);

// kakao site login
router.get('/kakao', passport.authenticate('kakao'));

// kakao site login 후 자동 redirect
// kakao 계정 정보를 이용하여 login or 회원가입/login
router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get('/join', (req, res) => {
  res.render('../views/join/join.html');
});

router.post('/join', async (req, res) => {
  const {
    username,
    password,
    name,
    homeName,
    homeComment
  } = req.body;

  const hash = await bcrypt.hash(password, 12);
  await User.create({
    username: username,
    password: hash,
    name: name,
    homeName: homeName,
    homeComment: homeComment
  });

  res.redirect('/login');
});

router.post('/username', async (req, res) => {
  const { username } = req.body;

  const result = await User.findAll({
    where: { username: username }
  });

  console.log(result);

  res.send({ result: result });
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
