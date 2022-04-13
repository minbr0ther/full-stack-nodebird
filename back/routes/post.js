const express = require('express');

const { Post } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    next(error);
  }
});

// :postId이 동적으로 바뀜 => parameter
router.post(`/:postId/comment`, isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    // 🚨 return 해줘야 한번만 send함
    if (!post) return res.status(403).send('존재하지 않는 게시글입니다.');

    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId,
      UserId: req.user.id,
    });
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    next(error);
  }
});

router.delete('/', (req, res) => {});

module.exports = router;
