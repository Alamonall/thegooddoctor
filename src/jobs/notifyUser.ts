import { Job } from 'bullmq';
import { Error } from 'mongoose';
import Doctor from '../model/Doctor';
import User from '../model/User';
import { NotifyUserJob } from '../types';

export default async function notifyUser(
  job: Job<NotifyUserJob>,
): Promise<void> {
  const { doctorId, slot_date_time, type } = job.data;

  console.debug({
    msg: `got_${job.name}`,
    job_id: job.id,
    job_name: job.name,
    doctor_id: doctorId,
    slot_date_time,
    type,
  });
  const doctor = await Doctor.findById(doctorId);

  if (!doctor) {
    throw new Error('Failed to find doctor by id');
  }

  const requestedSlotIndex = doctor.slots.findIndex(
    (slot) =>
      new Date(slot.date_time).getTime() === new Date(slot_date_time).getTime(),
  );

  const slot = doctor.slots[requestedSlotIndex];
  console.debug({ msg: 'found_slot', slot });

  if (!slot) {
    throw new Error('Failed to find slot by date time');
  }

  const user = await User.findById(slot.user_id);

  if (!user) {
    throw new Error('Failed to find user by id');
  }

  if (type === 'hourly') {
    console.log({
      msg: `${new Date().toISOString()} | Привет, ${
        user.name
      }! Вам через 2 часа к ${doctor.name} в ${slot.date_time}!`,
    });
  }
  if (type === 'daily') {
    console.log({
      msg: `${new Date().toISOString()} | Привет, ${
        user.name
      }! Напоминаем что вы записаны к ${doctor.name} завтра в ${
        slot.date_time
      }!`,
    });
  }

  const notFreeSlots = doctor.slots
    .filter(
      (item) =>
        item.date_time !== slot.date_time &&
        item.is_free &&
        item.user_id &&
        !item.is_notified_before_one_day &&
        !item.is_notified_before_two_hours,
    )
    .sort((a, b) => (a.date_time > b.date_time ? 1 : -1));
  const earliestEntry = notFreeSlots.length > 0 ? notFreeSlots[0] : null;

  doctor.slots[requestedSlotIndex] = {
    ...slot,
    is_notified_before_two_hours: type === 'hourly',
    is_notified_before_one_day: type === 'daily',
  };
  doctor.earliest_entry = earliestEntry?.date_time ?? null;
  const updatedDoctor = await doctor.save();

  console.debug({
    msg: `complete_${job.name}`,
    job_name: job.name,
    job_id: job.id,
    doctor: updatedDoctor,
    slots: JSON.stringify(updatedDoctor.slots),
    type,
  });
}
