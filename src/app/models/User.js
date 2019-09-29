import bcrypt from 'bcryptjs';
import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  check(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  static associate(models) {
    // this.hasMany(models.Meetapp);

    this.belongsToMany(models.Meetapp, {
      as: 'meetapps',
      through: 'Subscriber',
      foreignKey: 'user_id',
    });
  }
}

export default User;
