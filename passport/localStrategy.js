const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

// 로컬 전략을 생성하여 내보냅니다.
module.exports = new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  async (username, password, done) => {
    console.info('___new LocalStrategy()');

    try {
      // 입력된 사용자명으로 사용자를 조회합니다.
      const exUser = await User.findOne({ where: { username } });

      if (exUser) {
        // 사용자가 존재하는 경우, 비밀번호를 비교합니다.
        const result = await bcrypt.compare(password, exUser.password);

        if (result) {
          // 비밀번호가 일치하는 경우, 인증을 완료합니다.
          done(null, exUser);
        } else {
          // 비밀번호가 일치하지 않는 경우, 인증 실패 메시지를 반환합니다.
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        // 사용자가 존재하지 않는 경우, 인증 실패 메시지를 반환합니다.
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      // 오류가 발생한 경우, 오류를 전달합니다.
      console.error(error);
      done(error);
    }
  }
);
