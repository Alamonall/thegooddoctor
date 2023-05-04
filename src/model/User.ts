import mongoose from 'mongoose';
import { IUser } from '../types';
const { Schema, model } = mongoose;

const userSchema = new Schema<IUser>({
  phone: String,
  name: String,
});

export default model('User', userSchema);
