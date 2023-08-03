import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import {
  loginValidation,
  registerValidation,
  postCreateValidation,
  commentValidation,
} from './validations/index.js';
import { PostController, UserController, CommentController } from './controllers/index.js';
import { handleValidErrors, checkAuth } from './utils/index.js';
import cors from 'cors';
import {
  checkCreatorUser,
  checkCreatorUserComment,
  checkUserAdmin,
} from './utils/checkCreatorUser.js';
import { checkHasComment, checkHasPost, checkHasUser } from './utils/checkHas.js';

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

app.post('/auth/login', loginValidation, checkHasUser, handleValidErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidErrors, UserController.register);
app.get('/auth/me', checkAuth, checkHasUser, UserController.getMe);
app.delete('/auth/me', checkAuth, checkHasUser, UserController.remove);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', checkHasPost, PostController.getOne);

app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.patch(
  '/posts/:id',
  checkAuth,
  checkHasPost,
  checkCreatorUser,
  postCreateValidation,
  PostController.update,
);
app.delete('/posts/:id', checkAuth, checkHasPost, checkUserAdmin, PostController.postDelete);

app.post('/posts/:id/comment', checkAuth, commentValidation, CommentController.create);
app.get('/posts/:id/comment', CommentController.get);

app.patch(
  '/posts/:id/comment/:commentId',
  checkAuth,
  checkHasComment,
  checkCreatorUserComment,
  commentValidation,
  CommentController.update,
);
app.delete(
  '/posts/:id/comment/:commentId',
  checkAuth,
  checkHasComment,
  checkCreatorUser,
  (req, res, next) => {
    if (req.isCreator) {
      return next();
    }
    checkCreatorUserComment(req, res, next);
  },
  CommentController.remove,
);

app.listen(process.env.PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log('Server START');
  }
});
