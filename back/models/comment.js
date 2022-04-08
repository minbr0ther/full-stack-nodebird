module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      // id는 자동으로 MySQL이 넣어줌 (기본적으로 들어있다)
      content: {
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
  Comment.associate = (db) => {};
  return Comment;
};
