/* 프로필 설정 및 편집 */

const express = require('express');
const path = require('path');
const multer = require('multer');
const { User } = require('../models');

// 설정된 파일 저장 방식 및 필터링
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets/img/'); // 이미지가 저장되는 폴더 경로 지정
    },
    filename: (req, file, cb) => {
        cb(null, new Date().valueOf() + path.extname(file.originalname)); // 저장되는 파일 이름 설정
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true); // 허용되는 이미지 확장자인 경우 true 반환
    } else {
        cb(null, false); // 허용되지 않는 이미지 확장자인 경우 false 반환
    }
};

const upload = multer({ storage: fileStorage, fileFilter: fileFilter }); // 업로드 설정

const router = express.Router();

// 프로필 화면 렌더링
router.get('/', async (req, res) => {
    const getUser = await User.findOne({
        where: { id: req.user.id }
    });
    res.render('../views/profile/profile.html', { user: getUser.dataValues });
});

// 프로필 정보 업데이트
router.post('/:id', upload.single('img'), async (req, res, next) => {
    console.log('Upload -------------------------');

    const { homeName, homeComment } = req.body;

    console.log(req.file);

    if (req.file) {
        // 이미지 파일이 업로드된 경우
        await User.update({
            homeName: homeName,
            homeComment: homeComment,
            homeImagePath: req.file.path.replaceAll('\\', '/').replaceAll('public', ''),
        }, {
            where: { id: req.user.id }
        });
    } else {
        // 이미지 파일이 업로드되지 않은 경우
        await User.update({
            homeName: homeName,
            homeComment: homeComment,
        }, {
            where: { id: req.user.id }
        });
    }

    res.redirect(`/profile`);
});

module.exports = router;
