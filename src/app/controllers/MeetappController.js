import * as yup from 'yup';

import { isBefore, startOfHour } from 'date-fns';
import Meetapp from '../models/Meetapp';
import User from '../models/User';
// import pt from 'date-fns/locale/pt';

class MeetappController {
  async index(req, res) {
    const meetappCreatedByUser = await Meetapp.findAll({
      where: { user_id: req.userId },
      attributes: ['title', 'desc', 'date'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],
    });

    res.json(meetappCreatedByUser);
  }

  async store(req, res) {
    const schema = yup.object().shape({
      title: yup.string().required(),
      desc: yup.string().required(),
      location: yup.string().required(),
      date: yup.date().required(),
      user_id: yup.number().required(),
      image_id: yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validations fails ' });
    }

    const {
      date, user_id, image_id, title, location, desc,
    } = req.body;

    const hourStart = startOfHour(date);

    if (isBefore(hourStart, new Date())) {
      return res.status(401).json({
        error: 'Past Date is not permited',
      });
    }
    // console.log
    const meetapp = await Meetapp.create({
      date,
      location,
      desc,
      title,
      user_id,
      image_id,
    });

    return res.json(meetapp);
  }

  async update(req, res) {
    const { id } = req.params;

    const meetapp = await Meetapp.findOne({
      where: { id },
    });

    if (meetapp.user_id !== req.userId) {
      return res.status(401).json({ error: 'User is not owner of meetapp' });
    }

    const hourStart = startOfHour(meetapp.date);

    if (isBefore(hourStart, new Date())) {
      return res.status(401).json({
        error: 'You cant update meetap on past date or with an hour of diference',
      });
    }

    const metaap = await meetapp.update(req.body);

    return res.json(metaap);
  }

  async delete(req, res) {
    const { id } = req.params;
    const meetapp = await Meetapp.findOne({
      where: { id },
    });

    if (meetapp.user_id !== req.userId) {
      return res.status(401).json({ error: 'User is not owner of meetapp' });
    }

    const hourStart = startOfHour(meetapp.date);

    if (isBefore(hourStart, new Date())) {
      return res.status(401).json({
        error: 'You cant delet meetap on past date or with an hour of diference',
      });
    }

    meetapp.destroy(meetapp.id);

    return res.json({ message: 'Meetapp have been excluded' });
  }
}

export default new MeetappController();
