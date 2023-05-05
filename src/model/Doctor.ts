import mongoose from 'mongoose';
import { IDoctor, Slot } from '../types/index';
const { Schema, model } = mongoose;

const doctorSchema = new Schema<IDoctor>({
  name: String,
  spec: String,
  slots: Array<Slot>,
  earliest_entry: Date,
});

export default model('Doctor', doctorSchema);
