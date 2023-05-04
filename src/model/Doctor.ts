import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import IDoctor from '../types/index';

const doctorSchema = new Schema<IDoctor>({
	name: String,
	spec: String,
	slots: Array<Date>,
});

export default model('Doctor', doctorSchema);
