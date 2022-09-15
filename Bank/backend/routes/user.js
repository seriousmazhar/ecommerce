const express = require('express');
const router = express.Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');

//Registration of User

router.post('/new', async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      phone: req.body.phone,
      pin: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString(),
      accno: req.body.accno,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json({ err });
    //console.log(err);
  }
});

router.post('/balance', async (req, res) => {
  try {
    const user = await User.findOne({ accno: req.body.accno });
    if (!user) {
      res.status(404).json('Account Number Not Matching');
      return;
    }
    const hashedpin = CryptoJS.AES.decrypt(
      user.pin,
      process.env.SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (hashedpin !== req.body.pin) {
      res.status(500).json('Incorrect PIN');
      return;
    }

    res.status(200).json({ name: user.name, balance: user.balance });
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
