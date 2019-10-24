const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;

const comentSchema = new mongoose.Schema({
  spot_id: {
    type: objectId,
    ref: 'Spot',
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    required: true
  },
  comment_text: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Coment', comentSchema);
