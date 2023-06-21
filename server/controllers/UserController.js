import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const passsword = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(passsword, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      imageUrl: req.body.imageUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET,
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    return res.json({
      success: true,
      data: { ...userData },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'User Register', message: error });
  }
};

export const login = async (req, res) => {
  try {
    const isValidPass = await bcrypt.compare(req.body.password, req.user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(404).json({
        message: 'Password incorrect',
      });
    }

    const token = jwt.sign(
      {
        _id: req.user._id,
      },
      process.env.SECRET,
      { expiresIn: '30d' },
    );

    const { passwordHash, ...userData } = req.user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(505).json({ error: 'User Login', message: error });
  }
};

export const getMe = async (req, res) => {
  try {
    const { passwordHash, ...userData } = req.user._doc;
    return res.json(userData);
  } catch (error) {
    console.log(error);
    return res.status(505).json({ error: 'User Get', message: error });
  }
};

export const remove = async (req, res) => {
  try {
    await req.user.deleteOne();
    return res.json({ message: 'success' });
  } catch (error) {
    console.log(error);
    return res.status(505).json({ error: 'User Remove', message: error });
  }
};
