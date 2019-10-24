const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  photo_url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

module.exports = mongoose.model('Spot', spotSchema);
