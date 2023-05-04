export default interface IUser {
  phone: string;
  name: string;
}

export default interface IDoctor {
  name: string;
  spec: string;
  slots: Array<Date>;
}

export default interface ISlot {
  doctor_id: number;
  user_id: number;
  slot: Date;
}
