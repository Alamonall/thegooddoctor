import mongoose from 'mongoose';
import { IDoctor } from '../types/index';
const { Schema, model } = mongoose;

const doctorSchema = new Schema<IDoctor>({
  name: String,
  spec: String,
  slots: Array<{
    user_id: number;
    date_time: Date;
    is_free: boolean;
  }>,
});

export default model('Doctor', doctorSchema);
