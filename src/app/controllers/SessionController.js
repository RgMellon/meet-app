import jwt from 'jsonwebtoken';

import * as yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/authConfig';

class SessionController {
  async store(req, res) {
    const schema = yup.object().shape({
      // name: yup.string().required(),
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

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(401).json({ error: 'Users not found' });

    if (!(await user.check(password)))
      return res.status(401).json({ error: 'password does not match' });

    const { id, name } = user;

    return res.json({
      user: {
        name,
        id,
        email,
      },
      token: jwt.sign({ id }, authConfig.hash, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
