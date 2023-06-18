import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { loginValidation, registerValidation, postCreateValidation } from './validations/index.js';
import { PostController, UserController } from './controllers/index.js';
import { handleValidErrors, checkAuth } from './utils/index.js';
import cors from 'cors';

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@cluster0.fh4uljg.mongodb.net/blog?retryWrites=true&w=majority`,
  )
  .then(() => {
    console.log('DB OK');
  })
  .catch(err => {
    console.log('DB ERROR', err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `uploads/${req.file.originalname}`,
  });
});

app.post('/auth/login', loginValidation, handleValidErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.postDelete);
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update);

app.listen(process.env.PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log('Server START');
  }
});
