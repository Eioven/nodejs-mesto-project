import express, {
  Express, Request, Response, NextFunction,
} from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRoutes';
import cardRouter from './routes/cardRoutes';

const app: Express = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/mestodb');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB database: mestodb');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: any, res: Response, next: NextFunction) => {
  req.user = {
    id: '6923bd13bb3ae1e13ae34834',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Ошибка по умолчанию' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
