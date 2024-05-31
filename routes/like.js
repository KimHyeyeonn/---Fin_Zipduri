/* 좋아요 */
const express = require('express');
const Like = require('../models/like');

const router = express.Router();

// 좋아요 추가
router.post('/:id', async (req, res) => {

    const guestBookId = req.params.id;

    const { likeUser } = req.body;

    // 좋아요 데이터 생성
    await Like.create({
        like: guestBookId,
        likeUser: likeUser
    });

    res.send({ ok: 'ok' });

});

// 좋아요 삭제
router.delete('/:id', async (req, res) => {
    
    const guestBookId = req.params.id;

    const { likeUser } = req.body;

    // 좋아요 데이터 삭제
    Like.destroy({
        where: {
            like: guestBookId,
            likeUser: likeUser
        }
    });

    res.send({ ok: 'ok' });

});

module.exports = router;
