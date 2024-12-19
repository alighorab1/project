const mongoose = require ('mongoose');
require ('dotenv').config ();

const connectDB = async () => {
  try {
    const dbUrl = process.env.DB_URL || 'mongodb://localhost/notes';
    await mongoose.connect (dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log ('Database connected');
  } catch (error) {
    console.error ('Database connection error:', error);
    process.exit (1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect ();
    console.log ('Database disconnected');
  } catch (error) {
    console.error ('Database disconnection error:', error);
  }
};

module.exports = {connectDB, disconnectDB};
