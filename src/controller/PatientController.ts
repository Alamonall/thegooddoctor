import { Queue } from 'bullmq';
import express, { Request, Response } from 'express';
import util from 'util';
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
    try {
      const { user_id: userId, doctor_id: doctorId, slot: rawDate } = req.body;
      const slot = new Date(new Date(rawDate).toUTCString());
      console.log({
        msg: 'got_book',
        user_id: userId,
        doctor_id: doctorId,
        slot,
        rawDate,
      });

      if (!slot.getMonth()) {
        return res.status(400).send({ error_details: 'Invalid Date' });
      }

      if (slot.getTime() < Date.now()) {
        return res.status(400).send({ error_details: 'Invalid time' });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send({ error_details: 'User not found' });
      }

      const doctor = await Doctor.findById(doctorId);

      if (!doctor) {
        return res.status(404).send({ error_details: 'Doctor not found' });
      }

      const requestSlotIndex = doctor.slots.findIndex(
        (doctorSlot) => doctorSlot.date_time.getTime() === slot.getTime(),
      );

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

      doctor.slots[requestSlotIndex] = slotToUpdate;

      await doctor.save();

      res.status(200).json({
        message:
          'We will notify you one day and two hours before the appointment',
      });
    } catch (error: unknown) {
      console.error({
        msg: 'unknown_error',
        route: req.route,
        error: util.inspect(error),
      });
      res.status(500).json({
        error_details: 'Something went wrong. Please try again later',
      });
    }
  }
}
