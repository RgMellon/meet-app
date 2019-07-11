import { Model } from 'sequelize';

class Subscriber extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user_subscriber',
    });

    this.belongsTo(models.Meetapp, {
      foreignKey: 'meetapp_id',
      as: 'meetapp_subscriber',
    });
  }
}

export default Subscriber;
