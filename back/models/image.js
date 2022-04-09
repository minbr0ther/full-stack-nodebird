module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    'Image',
    {
      // id는 자동으로 MySQL이 넣어줌 (기본적으로 들어있다)
      src: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      // emoji 사용을 위해 mb4추가
      charset: 'utf8',
      collate: 'utf8_general_ci', // 이모티콘 저장
    },
  );
  Image.associate = (db) => {
    // 이미지는 게시물에 속한다
    db.Image.belongsTo(db.Post);
  };
  return Image;
};
