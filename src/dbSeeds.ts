import Doctor from './model/Doctor';
import User from './model/User';
import { generateSlots } from './utils';

export default async function dbSeeds() {
  console.log('start seeds');

  await Doctor.deleteMany({});
  await User.deleteMany({});
  const doctorHausSlots = generateSlots(13, 4);
  const doctorHaus = new Doctor({
    _id: '64562aa317adfccaa311cf97',
    name: 'Haus',
    spec: 'Therapist',
    earliest_entry: null,
    slots: doctorHausSlots,
  });

  const doctorGriffinSlots = generateSlots(13, 4);
  const doctorGriffin = new Doctor({
    _id: '64562a67793c2860c3cc7c9b',
    name: 'Bykov',
    spec: 'Surgeon',
    earliest_entry: null,
    slots: doctorGriffinSlots,
  });
  await doctorGriffin.save();
  await doctorHaus.save();

  const userWoman = new User({
    phone: '8 999 999 999 9',
    name: 'Natali',
  });

  const userOldGuy = new User({
    phone: '8 888 888 888 8',
    name: 'Sergey',
  });

  const userGuy = new User({
    _id: '64562aa317adfccaa311cf9d',
    phone: '8 777 777 777 7',
    name: 'Alex',
  });

  await userGuy.save();
  await userOldGuy.save();
  await userWoman.save();

  console.log({
    msg: 'complete seeds',
  });
}
