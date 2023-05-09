import { Queue } from 'bullmq';
import { NOTIFY_USER } from '../constants';
import Doctor from '../model/Doctor';
import User from '../model/User';
import { NotifyUserJob, Slot } from '../types';

const TWO_HOUR = 1000 * 60 * 60 * 2;
const ONE_DAY = TWO_HOUR * 12;
export default async function distributeNotifications(
  queues: Record<string, Queue>,
): Promise<void> {
  const dayAhed = new Date(Date.now() + ONE_DAY);
  console.log({ msg: 'got_job_distribute_notifications', day_ahed: dayAhed });
  const doctors = await Doctor.find({
    earliest_entry: {
      $lte: dayAhed,
    },
  });

  console.log({ doctors });
  doctors.forEach((doctor) => {
    doctor.slots.forEach(async (slot: Slot) => {
      if (
        slot.is_free ||
        !slot.user_id ||
        (slot.is_notified_before_two_hours && slot.is_notified_before_one_day)
      ) {
        return;
      }
      const handicap = slot.date_time.getTime() - Date.now();

      if (handicap >= 0 && handicap <= TWO_HOUR) {
        const user = await User.findById(slot.user_id);

        if (!user) {
          console.error('user not found');
          return;
        }

        const jobBody: NotifyUserJob = {
          doctorId: doctor.id,
          slot_date_time: slot.date_time,
          type: 'hourly',
        };

        await queues[NOTIFY_USER].add(NOTIFY_USER, jobBody, {
          jobId: `hourly_notification_${doctor.id}_${slot.date_time}`,
        });
        console.log({ msg: 'pushed_job_notify_user_by_2_hour' });
        return;
      }

      if (slot.date_time.getHours() == dayAhed.getHours()) {
        const user = await User.findById(slot.user_id);

        if (!user) {
          return;
        }

        const jobBody: NotifyUserJob = {
          doctorId: doctor.id,
          slot_date_time: slot.date_time,
          type: 'daily',
        };

        await queues[NOTIFY_USER].add(NOTIFY_USER, jobBody, {
          jobId: `daily_notification_${doctor.id}_${slot.date_time}`,
        });
        console.log({ msg: 'pushed_job_notify_user_by_day' });
        return;
      }
    });
  });
}
