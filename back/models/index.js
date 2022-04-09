const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';

// 작성한 config.json에서 development를 불러온다
const config = require('../config/config')[env];

const db = {};

// sequelize가 node랑 mysql을 연결시켜 준다
// 연결에 성공하면 객체에 정보가 담긴다
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

// require 해서 바로 실행, 시퀄라이저에 바로 등록
db.Comment = require('./comment')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Image = require('./image')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);

// 반복문 돌면서 관계들 연결을 해준다
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
