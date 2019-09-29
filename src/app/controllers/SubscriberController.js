import { isAfter, subHours, isBefore } from 'date-fns';
import { Op } from 'sequelize';

import Meetapp from '../models/Meetapp';
import Subscriber from '../models/Subscriber';
import User from '../models/User';
import File from '../models/File';

import WarnNewSubscriber from '../Jobs/WarnNewSubscriber';
import Queue from '../../lib/Queue';

class SubscriberController {
  async index(req, res) {
    const meetups = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email'],
      include: [
        {
          where: {
            date: { [Op.gt]: new Date() },
          },

          order: ['date'],

          model: Meetapp,
          as: 'meetapps',
          include: [
            {
              model: File,
              as: 'image',
              attributes: ['url', 'id', 'name'],
            },
            {
              model: User,
              as: 'user',
              attributes: ['name', 'email'],
            },
          ],

          attributes: ['title', 'desc', 'location', 'date', 'id'],
          through: { attributes: [] },
        },
      ],
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const { id } = req.params;

    const meetup = await Meetapp.findByPk(id, {
      include: [
        {
          model: User,
          as: 'subscribers',
          attributes: ['id', 'name'],
          through: { attributes: ['createdAt'], as: 'subscriber' },
        },
        {
          model: User,
          as: 'user',
        },
      ],
    });

    if (meetup.user_id === req.userId) {
      return res.status(401).json({ error: 'User already owner of meetup' });
    }

    const isSubscriberOnMeetapp = meetup.subscribers.find(
      user => user.id === req.userId
    );

    if (isSubscriberOnMeetapp) {
      return res.status(401).json({
        error: 'User already subscriber on meetup',
      });
    }

    const { date } = meetup;

    if (isAfter(new Date(), date)) {
      return res.status(401).json({
        error: 'meetup alredy happened',
      });
    }

    const haveMeetupOnTheSameTime = await User.findByPk(req.userId, {
      include: [
        {
          model: Meetapp,
          as: 'meetapps',
          where: { date },

          through: { attributes: [] },
        },
      ],
    });

    if (haveMeetupOnTheSameTime) {
      return res.status(401).json({
        error: 'You cant subbscriber in two meetup in the same time',
      });
    }

    /**
     *  Avisa que existe um novo inscrito no meetup
     */

    await Queue.add(WarnNewSubscriber.key, {
      meetup,
    });

    const subscriber = await Subscriber.create({
      user_id: req.userId,
      meetapp_id: id,
    });

    return res.json(subscriber);
  }

  async delete(req, res) {
    const { id } = req.params;

    const meetup = await Meetapp.findByPk(id);

    if (isAfter(new Date(), meetup.date)) {
      return res.status(401).json({
        error: 'meetup alredy happened',
      });
    }

    const dateWithSub = subHours(meetup.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        message: 'You can only cancel appointments 2 hours in advance',
      });
    }

    const meetupSubscriber = await Subscriber.findOne({
      where: { user_id: req.userId, meetapp_id: id },
    });

    meetupSubscriber.destroy(meetupSubscriber.id);

    return res.json({ subscriber: 'Subscriber have been cancel' });
  }
}

export default new SubscriberController();
