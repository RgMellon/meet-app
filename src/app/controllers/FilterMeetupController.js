import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Meetap from '../models/Meetapp';
import User from '../models/User';

class FilterMeetupController {
  async index(req, res) {
    const { date, page = 1 } = req.query;

    const meetupsByDate = await Meetap.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],
      attributes: ['title', 'desc', 'date'],
      order: ['date'],
    });

    return res.json({
      message: meetupsByDate,
    });
  }
}

export default new FilterMeetupController();
