const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/user');

// 카카오 전략을 생성하여 내보냅니다.
module.exports = new KakaoStrategy(
  {
    //clientID: process.env.KAKAO_ID,
    clientID: 'ad731f17726e7058bacc55a2931421c7',
    callbackURL: '/kakao/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    console.info('___new KakaoStrategy()');
    console.log('___kakao profile', profile);

    try {
      // 카카오 계정 정보를 기반으로 사용자를 조회합니다.
      const exUser = await User.findOne({
        where: { username: profile._json.kakao_account.email, provider: profile.provider },
      });

      if (exUser) {
        // 이미 등록된 사용자인 경우, 해당 사용자를 반환합니다.
        console.log('___kakao exUser', exUser);
        done(null, exUser);
      } else {
        // 새로운 사용자인 경우, 사용자를 생성합니다.
        const newUser = await User.create({
            username: profile._json && profile._json.kakao_account.email,
            password: '',
            name: profile._json.properties.nickname,
            homeName: '',
            homeComment: '',
            homeImagePath: '',
            provider: profile.provider,
        });
        console.log('___kakao newUser', newUser);
        done(null, newUser);
      }
    } catch (error) {
      // 오류가 발생한 경우, 오류를 전달합니다.
      console.error(error);
      done(error);
    }
  }
);
