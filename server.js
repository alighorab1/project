const express = require ('express');
const cors = require ('cors');
const mongoose = require ('mongoose');
const userRoutes = require ('./routers/userRoutes');
const noteRoutes = require ('./routers/noteRoutes');
const {config} = require ('dotenv');

config ();

const app = express ();

mongoose
  .connect (process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then (() => console.log ('MongoDB connected'))
  .catch (err => console.error ('MongoDB connection error:', err));

app.use (cors ());
app.use (express.json ());

app.use ('/users', userRoutes);
app.use ('/notes', noteRoutes);

app.use ((error, req, res, next) => {
  console.error (error);
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  res.status (statusCode).json ({from: 'ErrorHandling Mid', error: message});
});

app.use ('*', (req, res) => {
  res.sendStatus (404);
});

const PORT = process.env.PORT || 3000;
app.listen (PORT, () => {
  console.log (`Server running on port ${PORT}`);
});
