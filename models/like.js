const Sequelize = require('sequelize');

// Like 모델 정의
module.exports = class Like extends Sequelize.Model {
    static init(sequelize) {
        // super.init 메소드를 호출하여 모델을 초기화합니다.
        return super.init(
            {
                likeUser: {
                    type: Sequelize.INTEGER,
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
                modelName: 'Like',
                tableName: 'likes',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        )
    }

    static associate(db) {
        // 다른 모델과의 관계를 설정합니다.
        // Like 모델은 GuestBook 모델에 속하며, 'like' 컬럼을 GuestBook 모델의 'id' 컬럼과 연결합니다.
        db.Like.belongsTo(db.GuestBook, { foreignKey: 'like', sourceKey: 'id' });
    }
}
