/* 댓글 */

const express = require('express');
const { sequelize, Comments } = require('../models');
const path = require('path');

const router = express.Router();

// 특정 게스트북에 대한 댓글 조회
router.get('/:id', async (req, res) => {
    
    const guestBookId = req.params.id;

    // 게스트북 ID를 기준으로 댓글 정보 조회
    const [result, metadata] = await sequelize.query(`
        SELECT
            createUser,
            createUserName,
            content,
            updateDate
        FROM
            COMMENTS
        WHERE
            COMMENTS = ${guestBookId}
        ORDER BY
            CREATEDATE DESC,
            UPDATEDATE DESC;
    `);

    console.log('comments ------------------------------------');
    res.send({ result: result });
});

// 댓글 작성
router.post('/', (req, res) => {

    const { createUser, createUserName, content, comments } = req.body;

    // 댓글 생성
    Comments.create({
        createUser,
        createUserName,
        content,
        comments
    });

    res.send({ ok: 'ok' });
});

module.exports = router;
