import {
  startOfDay, endOfDay, setHours, setMinutes, setSeconds, format, isAfter,
} from 'date-fns';

class TesteController {
  async index(req, res) {
    const { date } = req.query;

    const searchDate = Number(date);

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];

    const available = schedule.map((time) => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(setMinutes(setHours(searchDate, hour), minute), 0);

      console.log(value);
      return {
        value,
      };
    });

    return res.json(available);
  }
}

export default new TesteController();
