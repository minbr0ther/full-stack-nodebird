const express = require('express');
const { Op } = require('sequelize');
const { Post, Hashtag, Image, Comment, User } = require('../models');
const router = express.Router();

router.get('/:hashtag', async (req, res, next) => {
  // GET hashtag/노드버드
  try {
    const where = {};
    // 초기 로딩이 아닐 때, 더 불러오는 상황
    if (parseInt(req.query.lastId, 10)) {
      // lastId 보다 작은것을 불러오라는 조건 + limit 10개 불러와라
      // Operator.less than 10 (< 10)
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
      console.log(` 👀where.id ${where.id}`);
    } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [
        {
          model: Hashtag,
          where: { name: decodeURIComponent(req.params.hashtag) }, // Hashtag 검색
        },
        {
          model: User,
          attributes: ['id', 'nickname'],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
            },
          ],
        },
        {
          model: User, // 좋아요 누른 사람
          as: 'Likers',
          attributes: ['id'],
        },
        {
          model: Post,
          as: 'Retweet',
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
