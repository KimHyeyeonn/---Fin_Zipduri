const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const User = require('./user');
const GuestBook = require('./guestBook');
const Like = require('./like');
const Comments = require('./comments');

const db = {};

// Sequelize 인스턴스 생성 및 데이터베이스 연결 설정
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.GuestBook = GuestBook;
db.Like = Like;
db.Comments = Comments;

// 각 모델의 초기화 함수 호출
User.init(sequelize);
GuestBook.init(sequelize);
Like.init(sequelize);
Comments.init(sequelize);

// 각 모델 간의 관계 설정
User.associate(db);
GuestBook.associate(db);
Like.associate(db);
Comments.associate(db);

module.exports = db;
