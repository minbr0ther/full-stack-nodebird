const express = require('express');

const { Post, Image, Comment } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });

    // post에 아직 Image나 추가 정보가 없기 때문에 보강해준다
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
        },
        {
          model: User,
        },
      ],
    });

    res.status(201).json(fullPost);
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
