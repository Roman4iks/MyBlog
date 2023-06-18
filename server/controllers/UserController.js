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

    res.json({
      success: true,
      data: { ...userData },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'ERROR' });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPass) {
      return res.status(404).json({
        message: 'Password incorrect',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET,
      { expiresIn: '30d' },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(505).json({ message: 'ServerError' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (error) {
    res.status(505).json({ message: 'Server Error' });
    console.log(error);
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.userId;
    const user = await UserModel.findOneAndRemove({
      _id: id,
    });
    if (!user) {
      res.json({ message: 'User not found' });
    } else {
      res.json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(505).json({ message: 'Server Error' });
  }
};
