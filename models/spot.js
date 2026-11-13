const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema({
  email: { type: String, required: true, trim: true },
  photo_url: { type: String, required: true },
  title: { type: String, required: true, trim: true, maxlength: 60 },
  address: { type: String, required: true, trim: true, maxlength: 200 },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: {
      type: [Number],
      required: true,
      validate: v =>
        v.length === 2 &&
        v.every(Number.isFinite) &&
        Math.abs(v[0]) <= 180 &&
        Math.abs(v[1]) <= 90
    }
  },
  created_at: { type: Date, default: Date.now }
});

spotSchema.index({ location: '2dsphere' });

module.exports = mongoose.models.Spot || mongoose.model('Spot', spotSchema);
