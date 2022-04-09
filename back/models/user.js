module.exports = (sequelize, DataTypes) => {
  // MySQL에는 users 테이블 생성
  const User = sequelize.define(
    'User',
    {
      // id는 자동으로 MySQL이 넣어줌 (기본적으로 들어있다)
      email: {
        // 글자 수를 30으로 제한
        type: DataTypes.STRING(30),
        // 필수 유무 true:선택적 / false:필수
        allowNull: false,
        // 고유한 값
        unique: true,
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false, // 필수
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci', // 한글 저장
    },
  );
  User.associate = (db) => {
    // 사람이 포스트를 여러개 갖고 있다
    db.User.hasMany(db.Post);
    // 사람이 댓글을 여러개 갖고 있다
    db.User.hasMany(db.Comment);
    // 사용자와 게시물의 좋아요 관계
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
    // 사용자와 사용자의 팔로우 관계
    db.User.belongsToMany(db.User, {
      through: 'Follow', // 테이블 이름 변경
      as: 'Followers',
      foreignKey: 'FollowingId', // 컬럼 변경
    });
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followings',
      foreignKey: 'FollowerId',
    });
  };
  return User;
};
