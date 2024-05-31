const Sequelize = require('sequelize');

// User 모델 정의
module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        // super.init 메소드를 호출하여 모델을 초기화합니다.
        return super.init(
            {
                username: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    unique: true
                },
                password: {
                    type: Sequelize.STRING(60),
                    allowNull: false,
                },
                name: {
                    type: Sequelize.STRING(15),
                    allowNull: false,
                },
                homeName: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                homeComment: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                homeImagePath: {
                    type: Sequelize.STRING(60),
                    allowNull: true,
                },
                createDate: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.NOW,
                },
                updateDate: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.NOW,
                },
                provider: {
                    type: Sequelize.STRING(10),
                    allowNull: false,
                    defaultValue: 'local',
                },
            },
            {
                sequelize: sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'User',
                tableName: 'users',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        )
    }

    static associate(db) {
        // 다른 모델과의 관계를 설정합니다.
        // User 모델은 GuestBook 모델에 속하며, 'guestBook' 컬럼을 User 모델의 'id' 컬럼과 연결합니다.
        db.User.hasMany(db.GuestBook, { foreignKey: 'guestBook', sourceKey: 'id' });
    }
}
