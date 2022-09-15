import express from 'express';
const router = express.Router();
import axios from 'axios';

router.put('/transfer', async (req, res) => {
  try {
    const url = 'http://localhost:7000/api/transfer';
    const response = await axios.put(url, req.body);
    if (response) {
      res.send(response.data);
      console.log(response.data);
    }
  } catch (err) {
    res.send(err);
    console.log(err);
  }
});

module.exports = router;
