const Sequelize = require('sequelize');

module.exports = class GuestBook extends Sequelize.Model {
    static init(sequelize) {
        // 모델의 초기화 메서드를 정의합니다. Sequelize의 Model 클래스를 상속받아 init 메서드를 호출합니다.
        return super.init(
            {
                // 모델의 속성을 정의합니다.
                comment: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                imgPath: {
                    type: Sequelize.STRING(60),
                    allowNull: false,
                },
                status: {
                    type: Sequelize.STRING(1),
                    allowNull: false,
                },
                createUser: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                createUserName: {
                    type: Sequelize.STRING(15),
                    allowNull: false,
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
            },
            {
                sequelize: sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'GuestBook',
                tableName: 'guestBooks',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    }

    static associate(db) {
        // 다른 모델과의 관계를 설정하는 메서드입니다. User, Like, Comments 모델과의 관계를 설정합니다.
        db.GuestBook.belongsTo(db.User, { foreignKey: 'guestBook', sourceKey: 'id' });
        db.GuestBook.hasMany(db.Like, { foreignKey: 'like', sourceKey: 'id' });
        db.GuestBook.hasMany(db.Comments, { foreignKey: 'comments', sourceKey: 'id' });
    }
}
