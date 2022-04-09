module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    'Hashtag',
    {
      // id는 자동으로 MySQL이 넣어줌 (기본적으로 들어있다)
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      // emoji 사용을 위해 mb4추가
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', // 이모티콘 저장
    },
  );
  Hashtag.associate = (db) => {
    // 다 대 다 관계
    db.Hashtag.belongsToMany(db.Post);
  };
  return Hashtag;
};
