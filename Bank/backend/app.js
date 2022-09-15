const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');

//Config
dotenv.config();
app.use(bodyParser.json());

//Databse
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('Database Connected'))
  .catch((err) => {
    console.log(err);
  });

app.get('/', (req, res) => {
  res.send('Bank');
});

//Import Route

const userRoute = require('./routes/user');
const transferRoute = require('./routes/transfer');

//Middlewear
app.use('/api/user', userRoute);
app.use('/api/transfer', transferRoute);

//Port
const port = process.env.PORT || 6000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
