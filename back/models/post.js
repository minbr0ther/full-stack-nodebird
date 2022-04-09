module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      // id는 자동으로 MySQL이 넣어줌 (기본적으로 들어있다)
      content: {
        // 글자 수 제한 없음
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      // emoji 사용을 위해 mb4추가
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', // 이모티콘 저장
    },
  );
  Post.associate = (db) => {
    // 게시글은 사람에게 속해있다
    db.Post.belongsTo(db.User);
    // 다 대 다 관계
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    // 게시글은 댓글을 여러개 가진다
    db.Post.hasMany(db.Comment);
    // 게시글은 이미지를 여러개 가진다
    db.Post.hasMany(db.Image);
    // 게시물과 사용자의 다대다 관계
    // 'Likers'로 db.User의 이름을 변경해준다 (헷갈리지 말라고)
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
    db.Post.belongsTo(db.Post), { as: 'Retweet' };
  };
  return Post;
};
