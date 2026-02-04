import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  email?: string;
  password?: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v: string) {
        return /^https?:\/\/(www\.)?[a-zA-Z\d-.]{1,}\.[a-z]{1,6}([/\w .-]*)#?$/.test(v);
      },
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true, // Allows multiple documents with null value for this field
  },
  password: {
    type: String,
    required: false,
    select: false, // Don't include password in queries by default
  },
});

export default mongoose.model<IUser>('user', userSchema);
