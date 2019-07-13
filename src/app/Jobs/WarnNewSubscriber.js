import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class WarnSubbscriber {
  get key() {
    return 'WarnSubscribberMail';
  }

  async handle({ data }) {
    const { meetup } = data;

    await Mail.sendMail({
      to: `${meetup.user.name} <${meetup.user.email}>`,
      subject: 'Novo inscrito no meetup',
      template: 'warnSubscriber',
      context: {
        owner: meetup.user.name,
        user: 'JUquinha',
        date: format(new Date(meetup.date), 'DD [de] MMMM YYYY [às] H:mm [h]', {
          locale: pt,
        }),
      },
    });
  }
}

export default new WarnSubbscriber();
