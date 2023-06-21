import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    if (posts.length === 0) {
      res.json({ message: 'Posts not created' });
    }
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server Error Post not send',
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    if (posts.length === 0) {
      res.json({ message: 'Posts not created' });
    }
    const tags = posts
      .map(obj => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server Error Posts not send',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    req.post.viewsCount++;
    await req.post.save();

    await req.post.populate('user');
    return res.json(req.post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'Post Get One',
      message: error,
    });
  }
};

export const postDelete = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndRemove({
      _id: postId,
    });

    if (!doc) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    res.json({ message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server Error Can`t Post Delete',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
      comments: [],
    });
    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server Error Can`t create post',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    const doc = await PostModel.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.body.user,
        tags: req.body.tags,
      },
    );
    res.json({ message: 'success', doc });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server Error Can`t update post',
    });
  }
};
