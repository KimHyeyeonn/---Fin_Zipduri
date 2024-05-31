/* 개인 별 집 리스트 */
const express = require('express');
const { sequelize } = require('../models');

const router = express.Router();

// 집 리스트 조회
router.get('/', async (req, res) => {

    // console.log(req.user);

    // 데이터베이스에서 집 리스트 조회
    const [result, metadata] = await sequelize.query(`
        SELECT
            id,
            name,
            homeName,
            homeComment,
            homeImagePath,
            createDate,
            updateDate
        FROM
            USERS
        ORDER BY
            UPDATEDATE DESC,
            CREATEDATE DESC;
    `);

    const data = {
        id: req.user.id,
        user: req.user,
        homeList: result
    }
    
    // 집 리스트를 템플릿에 전달하여 렌더링
    res.render('../views/home/home.html', data);

});

module.exports = router;
