import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Meetap from '../models/Meetapp';
import User from '../models/User';
import File from '../models/File';

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
        {
          model: File,
          as: 'image',
          attributes: ['url', 'name', 'path'],
        },
      ],
      attributes: ['title', 'desc', 'date', 'location', 'id'],
      order: ['date'],
    });

    return res.json({
      message: meetupsByDate,
    });
  }
}

export default new FilterMeetupController();
