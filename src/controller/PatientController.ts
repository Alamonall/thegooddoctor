import { Queue } from 'bullmq';
import express, { Request, Response } from 'express';
import loggerMiddleware from '../middleware/logger.middleware';
import Doctor from '../model/Doctor';
import User from '../model/User';
import { IExpressController } from '../types';

export default class PatientController implements IExpressController {
  path = '/api/v1/patient';
  router = express.Router();
  queues: Record<string, Queue>;

  constructor({ queues }: { queues: Record<string, Queue> }) {
    this.queues = queues;
    this.intializeRoutes();
    this.router.use(loggerMiddleware);
  }

  intializeRoutes() {
    this.router.post('/book', this.bookSlot);
  }

  async bookSlot(req: Request, res: Response) {
    const {
      user_id: userId,
      doctor_id: doctorId,
      slot: rawSlotDate,
    } = req.body;
    console.debug({
      msg: 'got_post_book',
      userId,
      doctorId,
      rawSlotDate,
    });

    const slot = new Date(rawSlotDate);

    if (!slot.getMonth()) {
      return res.status(400).send({ error_details: 'Invalid Date' });
    }

    const user = await User.findById(userId);

    console.debug({ msg: 'found_user', user });
    if (!user) {
      return res.status(404).send({ error_details: 'User not found' });
    }

    const doctor = await Doctor.findById(doctorId);
    console.debug({ msg: 'found_doctor', doctor });

    if (!doctor) {
      return res.status(404).send({ error_details: 'Doctor not found' });
    }

    const requestSlotIndex = doctor.slots.findIndex(
      (doctorSlot) => doctorSlot.date_time.getTime() === slot.getTime(),
    );

    console.debug({
      msg: 'available_slot',
      doctors_slot: doctor.slots[requestSlotIndex],
      requested_slot_time: slot,
    });

    if (requestSlotIndex === -1) {
      return res
        .status(400)
        .send({ error_details: 'Doctor does not accept at that time' });
    }

    const requestedSlot = doctor.slots[requestSlotIndex];

    if (!requestedSlot.is_free) {
      return res.status(400).send({ error_details: 'Slot is not free' });
    }

    const slotToUpdate = {
      ...requestedSlot,
      is_free: false,
      user_id: userId,
    };

    if (
      !doctor.earliest_entry ||
      doctor.earliest_entry.getTime() > slot.getTime()
    ) {
      doctor.earliest_entry = slot;
    }

    console.debug({
      msg: 'slot_to_update',
      slotToUpdate,
      earliestEntry: doctor.earliest_entry,
    });

    doctor.slots[requestSlotIndex] = slotToUpdate;

    await doctor.save();
    console.debug({ msg: 'updated_doctor', doctor });

    res.status(200).json({
      message:
        'We will notify you one day and two hours before the appointment',
    });
  }
}
