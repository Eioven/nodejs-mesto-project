import express, {
  Express,
} from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRoutes';
import cardRouter from './routes/cardRoutes';
import { login, createUser } from './controllers/userController';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/errorHandler';

const app: Express = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/mestodb');

const db = mongoose.connection;
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
db.once('open', () => {
  console.log('Connected to MongoDB database: mestodb');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('/', userRouter);
app.use('/cards', cardRouter);

app.post('/signin', (req, res, next) => login(req, res, next));
app.post('/signup', (req, res, next) => createUser(req, res, next));

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
