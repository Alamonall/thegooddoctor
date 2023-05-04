import express, { Request, Response } from 'express';
import Doctor from '../model/Doctor';
import Slot from '../model/Slot';
import User from '../model/User';

const router = express.Router();

router.post('/book', async (req: Request, res: Response) => {
  const { user_id: userId, doctor_id: doctorId, slot } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).send('User not found');
  }

  const doctor = await Doctor.findById(doctorId);

  if (!doctor) {
    return res.status(404).send('Doctor not found');
  }

  const isDoctorAvailable = doctor.slots.some(
    (doctorSlot) => doctorSlot === slot,
  );

  if (!isDoctorAvailable) {
    return res.status(400).send('Doctor does not accept at that time');
  }

  const takenSlots = await Slot.where({
    doctor_id: doctorId,
  });

  const isSlotAvailable = takenSlots.some((taken) => taken === slot);

  if (!isSlotAvailable) {
    return res.status(400).send('Slot already taken');
  }

  const newSlot = await Slot.insertMany({
    doctor_id: doctorId,
    user_id: userId,
    slot,
  });

  if (!newSlot) {
    return res.status(500).send('We cant accept that slot, please try again');
  }

  return res
    .status(200)
    .send('We will notify you two hours before the appointment');
});

export default router;
