import mongoose from 'mongoose';
import ISlot from '../types/index';
const { Schema, model } = mongoose;

const slotSchema = new Schema<ISlot>({
  doctor_id: Number,
  user_id: Number,
  slot: Date,
});

export default model('Slot', slotSchema);
