import Doctor from './model/Doctor';
import User from './model/User';
import { generateSlots } from './utils';

export default async function dbSeeds() {
  await Doctor.deleteMany({});
  await User.deleteMany({});
  const slots = [...generateSlots(0, 9, 12), ...generateSlots(1, 9, 12)];
  const doctorHaus = new Doctor({
    _id: '1',
    name: 'Haus',
    spec: 'Therapist',
    earliest_entry: null,
    slots,
  });

  const doctorGriffin = new Doctor({
    _id: '2',
    name: 'Bykov',
    spec: 'Surgeon',
    earliest_entry: null,
    slots,
  });
  await doctorGriffin.save();
  await doctorHaus.save();

  const userWoman = new User({
    _id: '1',
    phone: '8 999 999 999 9',
    name: 'Natali',
  });

  const userOldGuy = new User({
    _id: '2',
    phone: '8 888 888 888 8',
    name: 'Sergey',
  });

  const userGuy = new User({
    _id: '3',
    phone: '8 777 777 777 7',
    name: 'Alex',
  });

  await userGuy.save();
  await userOldGuy.save();
  await userWoman.save();
}
