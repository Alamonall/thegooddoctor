import mongoose from 'mongoose';
import { IDoctor, Slot } from '../types/index';
const { Schema, model } = mongoose;

const doctorSchema = new Schema<IDoctor>({
  _id: String,
  name: String,
  spec: String,
  slots: Array<Slot>,
  earliest_entry: Date,
});

export default model('Doctor', doctorSchema);
