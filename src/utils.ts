import { Slot } from './types';

export function generateSlots(
  dayOffset: number,
  startsWith: number,
  hours: number,
): Array<Slot> {
  let iteration = 0;
  const slots = [];
  while (iteration != hours) {
    const hour = iteration + startsWith - 3;
    const date = new Date();
    date.setHours(hour, 0, 0);
    const firstHalfAHour = new Date(new Date(date).toUTCString());
    const secondHalfAHour = new Date(
      new Date(date.setMinutes(30)).toUTCString(),
    );
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
