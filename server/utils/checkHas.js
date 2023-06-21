import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js';
import UserModel from '../models/User.js';

export const checkHasPost = async (req, res, next) => {
  try {
    const id = req.params.id;

    const post = await PostModel.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    req.post = post;

    return next();
  } catch (error) {
    return res.status(500).json({ message: 'Error Server' });
  }
};

export const checkHasComment = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;

    const doc = await CommentModel.findOne({
      post: id,
      _id: commentId,
    });

    if (!doc) {
      return res.status(404).json({
        error: 'Comment not found',
      });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ message: 'Error Server' });
  }
};

export const checkHasUser = async (req, res, next) => {
  let user;
  try {
    if (req.userId) {
      user = await UserModel.findOne({
        _id: req.userId,
      });
    } else if (req.body.email) {
      user = await UserModel.findOne({ email: req.body.email });
    }
    if (!user) {
      return res.json({ error: 'User not found' });
    }
    req.user = user;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error Server', message: error });
  }
};
