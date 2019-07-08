import * as yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup
        .string()
        .email()
        .required(),
      password: yup
        .string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validations fails ' });
    }

    const existsUser = await User.findOne({ where: { email: req.body.email } });

    if (existsUser) {
      return res.status(401).json({
        error: 'User already exists',
      });
    }

    const user = await User.create(req.body);

    const { id, name, email } = user;
    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string().email(),
      oldPassword: yup.string().min(6),
      password: yup
        .string()
        .min(6)
        .when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
      confirmPassword: yup
        .string()
        .when('password', (password, field) => (password ? field.required().oneOf([yup.ref('password')]) : field)),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validations fails ' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (oldPassword && !(await user.check(oldPassword))) {
      return res.status(401).json({ error: 'invalid password' });
    }

    if (user.email !== email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(401).json({ error: 'Emails already taken' });
      }
    }

    const { id, name } = await user.update(req.body);

    return res.json({ id, name, email });
    // if( email)
  }
}

export default new UserController();
