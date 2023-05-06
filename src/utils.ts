import { Slot } from './types';

export function generateSlots(startsWith: number, hours: number): Array<Slot> {
  let iteration = 0;
  const slots = [];
  console.log({ startsWith, hours });
  while (iteration != hours) {
    const hour = iteration + startsWith;
    const date = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}`;
    const firstHalfAHour = new Date(
      `${date} ${hour > 9 ? hour : `0${hour}`}:00:00`,
    );
    const secondHalfAHour = new Date(
      `${date} ${hour > 9 ? hour : `0${hour}`}:30:00`,
    );
    console.log({
      firstHalfAHour: firstHalfAHour,
      secondHalfAHour: secondHalfAHour,
    });
    slots.push(
      {
        date_time: firstHalfAHour,
        is_free: true,
        user_id: null,
        is_notified_before_two_hours: false,
        is_notified_before_one_day: false,
      },
      {
        date_time: secondHalfAHour,
        is_free: true,
        user_id: null,
        is_notified_before_two_hours: false,
        is_notified_before_one_day: false,
      },
    );
    iteration++;
  }

  return slots;
}
