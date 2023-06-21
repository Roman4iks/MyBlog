import jwt from 'jsonwebtoken';
import PostModel from '../models/Post.js';

export const checkCreatorUser = async (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (!token) {
    return res.status(403).json({
      message: 'No access',
    });
  }
  try {
    const decoded_user = jwt.verify(token, process.env.SECRET);
    const post = await PostModel.findById(req.params.id).populate('user');

    if (decoded_user._id === String(post.user._id)) {
      req.isCreator = true;
      next();
    } else {
      req.isCreator = false;
      return next();
    }
  } catch (error) {
    return res.status(403).json({
      message: 'Invalid checkCreatorUser',
    });
  }
};

export const checkCreatorUserComment = async (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  const { id, commentId } = req.params;

  if (!token) {
    return res.status(403).json({
      message: 'No access',
    });
  }

  try {
    const decoded_user = jwt.verify(token, process.env.SECRET);
    const post = await PostModel.findById(id).populate({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'fullName',
      },
    });

    const comment = post.comments.find(c => c._id.toString() === commentId);

    if (decoded_user._id === String(comment.author._id)) {
      next();
    } else {
      return res.status(403).json({
        message: 'You are not the creator comment',
      });
    }
  } catch (error) {
    return res.status(403).json({
      message: 'Invalid checkCreatorUserComment',
    });
  }
};

export const checkUserAdmin = async (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (!token) {
    return res.status(403).json({
      message: 'No access',
    });
  }

  try {
    const decoded_user = jwt.verify(token, process.env.SECRET);

    if (process.env.ID_USERS_ADMIN.includes(decoded_user._id)) {
      req.isAdmin = true;
      return next();
    }

    checkCreatorUser(req, res, next);
  } catch (error) {
    return res.status(403).json({
      message: 'Invalid request',
    });
  }
};
