import Doctor from './model/Doctor';
import User from './model/User';

export default async function databaseSeeds() {
  console.log('starting to seed');
  const slotStub = {
    date_time: '2023-05-10 00:00',
    is_free: true,
    user_id: null,
  };
  const doctorHaus = new Doctor({
    name: 'Haus',
    spec: 'Therapist',
    slots: [
      { ...slotStub, date_time: '2023-05-10 9:00' },
      { ...slotStub, date_time: '2023-05-10 9:30' },
      { ...slotStub, date_time: '2023-05-10 10:00' },
      { ...slotStub, date_time: '2023-05-10 10:30' },
      { ...slotStub, date_time: '2023-05-10 11:00' },
      { ...slotStub, date_time: '2023-05-10 11:30' },
      { ...slotStub, date_time: '2023-05-10 12:00' },
      { ...slotStub, date_time: '2023-05-10 12:30' },
      { ...slotStub, date_time: '2023-05-11 13:00' },
      { ...slotStub, date_time: '2023-05-11 13:30' },
      { ...slotStub, date_time: '2023-05-11 14:00' },
      { ...slotStub, date_time: '2023-05-11 14:30' },
      { ...slotStub, date_time: '2023-05-11 15:00' },
      { ...slotStub, date_time: '2023-05-11 15:30' },
      { ...slotStub, date_time: '2023-05-11 16:00' },
      { ...slotStub, date_time: '2023-05-11 16:30' },
      { ...slotStub, date_time: '2023-05-11 17:00' },
      { ...slotStub, date_time: '2023-05-12 9:00' },
      { ...slotStub, date_time: '2023-05-12 9:30' },
      { ...slotStub, date_time: '2023-05-12 10:00' },
      { ...slotStub, date_time: '2023-05-12 10:30' },
      { ...slotStub, date_time: '2023-05-12 11:00' },
      { ...slotStub, date_time: '2023-05-12 11:30' },
      { ...slotStub, date_time: '2023-05-12 12:00' },
      { ...slotStub, date_time: '2023-05-12 12:30' },
    ],
  });

  const doctorGriffin = new Doctor({
    name: 'Bykov',
    spec: 'Surgeon',
    slots: [
      { ...slotStub, date_time: '2023-05-10 13:00' },
      { ...slotStub, date_time: '2023-05-10 13:30' },
      { ...slotStub, date_time: '2023-05-10 14:00' },
      { ...slotStub, date_time: '2023-05-10 14:30' },
      { ...slotStub, date_time: '2023-05-10 15:00' },
      { ...slotStub, date_time: '2023-05-10 15:30' },
      { ...slotStub, date_time: '2023-05-10 16:00' },
      { ...slotStub, date_time: '2023-05-10 16:30' },
      { ...slotStub, date_time: '2023-05-11 9:00' },
      { ...slotStub, date_time: '2023-05-11 9:30' },
      { ...slotStub, date_time: '2023-05-11 10:00' },
      { ...slotStub, date_time: '2023-05-11 10:30' },
      { ...slotStub, date_time: '2023-05-11 11:00' },
      { ...slotStub, date_time: '2023-05-11 11:30' },
      { ...slotStub, date_time: '2023-05-11 12:00' },
      { ...slotStub, date_time: '2023-05-11 12:30' },
      { ...slotStub, date_time: '2023-05-12 13:00' },
      { ...slotStub, date_time: '2023-05-12 13:30' },
      { ...slotStub, date_time: '2023-05-12 14:00' },
      { ...slotStub, date_time: '2023-05-12 14:30' },
      { ...slotStub, date_time: '2023-05-12 15:00' },
      { ...slotStub, date_time: '2023-05-12 15:30' },
      { ...slotStub, date_time: '2023-05-12 16:00' },
      { ...slotStub, date_time: '2023-05-12 16:30' },
    ],
  });

  const userWoman = new User({
    phone: '8 999 999 999 9',
    name: 'Natali',
  });

  const userOldGuy = new User({
    phone: '8 888 888 888 8',
    name: 'Sergey',
  });

  const userGuy = new User({
    phone: '8 777 777 777 7',
    name: 'Alex',
  });

  await doctorHaus.save();
  await doctorGriffin.save();
  await userGuy.save();
  await userOldGuy.save();
  await userWoman.save();

  console.log('completed seeds');
}
