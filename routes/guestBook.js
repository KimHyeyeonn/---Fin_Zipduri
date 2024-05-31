/* 방명록 */

const express = require('express');
const path = require('path');
const passport = require('../passport/localStrategy');
const multer = require('multer');
const { GuestBook, Like, sequelize, Comments } = require('../models');

// 파일 저장 설정
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets/img/'); // 파일이 저장될 경로 지정
    },
    filename: (req, file, cb) => {
        cb(null, new Date().valueOf() + path.extname(file.originalname)); // 저장되는 파일명 지정
    }
});

// 파일 필터링 설정
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true); // 허용할 파일 형식만 허용
    } else {
        cb(null, false);
    }
};

// multer 설정
const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

const router = express.Router();

// 방명록 메인 페이지
router.get('/', async (req, res, next) => {

    if (!req.user) {
        res.redirect('/home');
        return;
    }

    // 방명록 리스트 조회
    const [result, metadata] = await sequelize.query(`
        SELECT
            TBL1.id,
            TBL1.comment,
            TBL1.imgPath,
            TBL1.status,
            TBL1.createUser,
            TBL1.createUserName,
            TBL1.createDate,
            TBL1.updateDate,
            (
                SELECT
                    CASE COUNT(*)
                    WHEN 0 THEN null
                    ELSE COUNT(*)
                    END AS likeFlg
                FROM 
                    LIKES as TBL2
                WHERE
                    TBL2.likeUSER = ${req.user.id}
                    AND TBL2.like = TBL1.id
            ) as likeFlg,
            (
                SELECT COUNT(*)
                FROM LIKES as TBL3
                WHERE
                    TBL3.LIKE = TBL1.id
            ) as likeCnt,
            (
                SELECT COUNT(*)
                FROM COMMENTS as TBL4
                WHERE
                    TBL4.COMMENTS = TBL1.id
            ) as commentCnt
        FROM
            guestBooks as TBL1
        WHERE
            TBL1.guestBook = ${req.user.id}
        ORDER BY
            UPDATEDATE DESC,
            CREATEDATE DESC;
    `);

    const data = {
        id: req.user.id,
        user: req.user,
        guestBookList: result
    };

    res.render('../views/guestBook/guestBook.html', data);
});

// 특정 방명록 조회
router.get('/:id', async (req, res) => {

    const id = req.params.id;

    // 방명록 정보 조회
    const [result, metadata] = await sequelize.query(`
        SELECT
            TBL1.id,
            TBL1.comment,
            TBL1.imgPath,
            TBL1.status,
            TBL1.createUser,
            TBL1.createUserName,
            TBL1.createDate,
            TBL1.updateDate,
            (
                ${req.user ?
                `SELECT
                    CASE COUNT(*)
                    WHEN 0 THEN null
                    ELSE COUNT(*)
                    END AS likeFlg
                FROM 
                    LIKES as TBL2
                WHERE
                    TBL2.likeUSER = ${parseInt(req.user.id)}
                    AND TBL2.like = TBL1.id
                ` : 'NULL'
                }
            ) as likeFlg,
            (
                SELECT COUNT(*)
                FROM LIKES as TBL3
                WHERE
                    TBL3.LIKE = TBL1.id
            ) as likeCnt,
            (
                SELECT COUNT(*)
                FROM COMMENTS as TBL4
                WHERE
                    TBL4.COMMENTS = TBL1.id
            ) as commentCnt
        FROM
            guestBooks as TBL1
        WHERE
            TBL1.guestBook = ${parseInt(id)}
        ORDER BY
            UPDATEDATE DESC,
            CREATEDATE DESC;
    `);

    const data = {
        id: id,
        user: req.user,
        guestBookList: result
    };
    
    res.render('../views/guestBook/guestBook.html', data);
});

// 방명록 작성 페이지
router.get('/write/:id', async (req, res) => {

    const id = req.params.id;

    res.render('../views/guestBook/guestBookWrite.html', { id: id, user: req.user });
});

// 방명록 수정 페이지
router.get('/:id/update/', async (req, res) => {

    console.log('update guestBook');
    const id = req.params.id;

    const guestBook = await GuestBook.findOne({
        where: { id: id }
    });
    console.log(guestBook);

    res.render('../views/guestBook/guestBookWrite.html', { id: id, user: req.user, guestBook: guestBook });
});

// 방명록 작성
router.post('/:id', upload.single('img'), async (req, res, next) => {

    console.log('Upload -------------------------');
    
    const user = req.user;
    const { comment } = req.body;
    
    // 방명록 생성
    await GuestBook.create({
        comment: comment,
        imgPath: req.file.path.replaceAll('\\', '/').replaceAll('public', ''),
        status: user.id === parseInt(req.params.id) ? '1' : '0',
        createUser: user.id,
        createUserName: user.name,
        guestBook: parseInt(req.params.id),
    });

    res.redirect(`${req.baseUrl}/${parseInt(req.params.id)}`);
});

// 방명록 수정
router.post('/:id/update', upload.single('img'), async (req, res, next) => {

    const id = req.params.id;

    const { comment } = req.body;
    
    if (req.file) {
        // 이미지 업데이트
        await GuestBook.update({
            comment: comment,
            imgPath: req.file.path.replaceAll('\\', '/').replaceAll('public', ''),
        }, {
            where: { id: id }
        });
    } else {
        // 이미지 미변경
        await GuestBook.update({
            comment: comment,
        }, {
            where: { id: id }
        });
    }

    const guestBook = await GuestBook.findOne({
        where: { id: id }
    });

    res.redirect(`${req.baseUrl}/${guestBook.guestBook}`);
});

// 방명록 삭제
router.delete('/:id', (req, res) => {

    console.log('guestBook delete');
    const id = req.params.id;

    // 방명록 삭제
    GuestBook.destroy({
        where: { id: id }
    });

    res.send({ status: 'ok' });

});

// 방명록 승인
router.put('/approval/:id', async (req, res) => {

    const id = req.params.id;

    // 방명록 승인 상태로 업데이트
    await GuestBook.update({
        status: '1',
    }, {
        where: { id: id }
    });

    res.send({ status: 'ok' });

});

module.exports = router;
