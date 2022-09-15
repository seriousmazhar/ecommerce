const express = require('express');
const router = express.Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');

router.put('/', async (req, res) => {
  try {
    senderACC = req.body.SA;
    receiverACC = req.body.RA;
    const sender = await User.findOne({ accno: senderACC });
    const receiver = await User.findOne({ accno: receiverACC });

    if (!receiver) {
      res.json({ message: 'Receiver Account is not Correct', success: false });
      return;
    }

    const hashedpin = CryptoJS.AES.decrypt(
      sender.pin,
      process.env.SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (hashedpin !== req.body.pin) {
      res.json({ message: 'Incorrect PIN', success: false });
      return;
    }

    amount = parseInt(req.body.amount);

    if (amount > sender.balance) {
      res.json({ message: 'Insufficient Balance', success: false });
      return;
    }

    sender.balance = sender.balance - amount;
    receiver.balance = receiver.balance + amount;

    await sender.save();
    await receiver.save();

    res.status(200).json({ success: true });
    console.log('success');
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

module.exports = router;
