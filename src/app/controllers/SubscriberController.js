import { isAfter } from 'date-fns';
import Meetapp from '../models/Meetapp';
import Subscriber from '../models/Subscriber';
import User from '../models/User';

class SubscriberController {
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
      ],
    });

    if (meetup.user_id === req.userId) {
      return res.status(401).json({ error: 'User already owner of meetup' });
    }

    const isSubscriberOnMeetapp = meetup.subscribers.find(user => user.id === req.userId);

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

    const subscriber = await Subscriber.create({
      user_id: req.userId,
      meetapp_id: id,
    });

    return res.json(subscriber);
  }
}

export default new SubscriberController();
