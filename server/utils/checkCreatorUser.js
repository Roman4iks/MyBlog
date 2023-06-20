import jwt from 'jsonwebtoken';
import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js';

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
      next();
    } else {
      return res.status(403).json({
        message: 'You are not the creator',
      });
    }
  } catch (error) {
    return res.status(403).json({
      message: 'Invalid token',
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
        message: 'You are not the creator',
      });
    }
  } catch (error) {
    return res.status(403).json({
      message: 'Invalid token',
    });
  }
};
