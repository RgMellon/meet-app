import Sequelize, { Model } from 'sequelize';

class Meetapp extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        desc: Sequelize.STRING,
        location: Sequelize.STRING,
        date: Sequelize.STRING,
      },
      {
        sequelize,
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    this.belongsTo(models.File, {
      foreignKey: 'image_id',
      as: 'image',
    });

    this.belongsToMany(models.User, {
      as: 'subscribers',
      through: 'Subscriber',
      foreignKey: 'meetapp_id',
    });
  }
}

export default Meetapp;
