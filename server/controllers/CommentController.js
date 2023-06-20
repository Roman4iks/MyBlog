import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';

export const get = async (req, res) => {
  try {
    const id = req.params.id;
    const comments = await PostModel.findById(id, 'comments')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'fullName',
        },
      })
      .exec();

    if (comments.length === 0) {
      res.json({ message: 'Comment not send' });
    }

    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server Error Post not send',
    });
  }
};

export const create = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await PostModel.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment = new CommentModel({
      post: id,
      author: req.userId,
      text: req.body.text,
    });

    const comment = await newComment.save();

    post.comments.push(comment._id);

    await post.save();

    res.json({ comment });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server Error Post not send',
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const doc = await CommentModel.findOneAndUpdate(
      {
        post: id,
        _id: commentId,
      },
      {
        text: req.body.text,
      },
      {
        new: true,
      },
    );
    if (!doc) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    res.json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server Error Post not send',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    // const doc = await CommentModel.findOneAndRemove({
    //   post: id,
    //   _id: commentId,
    // });
    // if (!doc) {
    //   return res.status(404).json({
    //     message: 'Post not found',
    //   });
    // }

    res.json({ message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server Error Post not send',
    });
  }
};
