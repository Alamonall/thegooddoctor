import Doctor from '../model/Doctor';
import User from '../model/User';

const TWO_HOUR = 1000 * 60 * 60 * 2;
const ONE_DAY = TWO_HOUR + 12;
export default async function notifyUser(): Promise<void> {
  const date: Date = new Date(new Date().setDate(new Date().getDate() + 1));
  console.log({ date });
  const doctors = await Doctor.find({
    erliest_entry: {
      $gte: date,
    },
  }).exec();

  doctors.forEach((doctor) => {
    doctor.slots.forEach(async (slot) => {
      if (!slot.user_id || slot.is_notified) {
        return;
      }
      const gandicup = new Date(slot.date_time).getTime() - Date.now();

      if (gandicup <= TWO_HOUR) {
        const user = await User.findById(slot.user_id).exec();

        if (!user) {
          return;
        }

        console.log({
          msg: `${new Date().toISOString()} | Привет, ${
            user.name
          }! Вам через 2 часа к ${doctor.name} в ${slot.date_time}!`,
        });
      }

      if (gandicup <= ONE_DAY) {
        const user = await User.findById(slot.user_id).exec();

        if (!user) {
          return;
        }

        console.log({
          msg: `${new Date().toISOString()} | Привет, ${
            user.name
          }! Напоминаем что вы записаны к  ${doctor.name} завтра в ${
            slot.date_time
          }!`,
        });
      }
    });
  });
}
