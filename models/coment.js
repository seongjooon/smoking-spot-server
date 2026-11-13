const mongoose = require('mongoose');

const comentSchema = new mongoose.Schema({
  spot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Spot', required: true, index: true },
  created_by: { type: String, required: true },
  created_at: { type: Date, required: true, default: Date.now },
  coment_text: { type: String, required: true, trim: true, maxlength: 500 },
  rate: { type: Number, required: true, min: 0, max: 5 }
});

module.exports = mongoose.models.Coment || mongoose.model('Coment', comentSchema);
