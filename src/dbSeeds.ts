import { v4 as uuid } from 'uuid';
import Doctor from './model/Doctor';
import User from './model/User';
import { generateSlots } from './utils';

export default async function dbSeeds() {
  console.log('start seeds');

  await Doctor.deleteMany({});
  await User.deleteMany({});
  const slots = [
    ...generateSlots(0, new Date().getHours(), 12),
    ...generateSlots(1, new Date().getHours(), 12),
  ];
  const doctorHaus = new Doctor({
    _id: uuid(),
    name: 'Haus',
    spec: 'Therapist',
    earliest_entry: null,
    slots,
  });

  const doctorGriffin = new Doctor({
    _id: uuid(),
    name: 'Bykov',
    spec: 'Surgeon',
    earliest_entry: null,
    slots,
  });
  await doctorGriffin.save();
  await doctorHaus.save();

  const userWoman = new User({
    _id: uuid(),
    phone: '8 999 999 999 9',
    name: 'Natali',
  });

  const userOldGuy = new User({
    _id: uuid(),
    phone: '8 888 888 888 8',
    name: 'Sergey',
  });

  const userGuy = new User({
    _id: uuid(),
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
