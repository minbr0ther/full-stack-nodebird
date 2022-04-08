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
  Post.associate = (db) => {};
  return Post;
};
