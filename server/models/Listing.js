const mongoose = require('mongoose');
const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['room', 'pg', 'flat'], required: true },
  city: { type: String, required: true },
  area: { type: String, required: true },
  address: String,
  rent: { type: Number, required: true },
  deposit: { type: Number, default: 0 },
  gender: { type: String, enum: ['boys', 'girls', 'unisex'], default: 'unisex' },
  amenities: [String],
  images: [String],
  available: { type: Boolean, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
listingSchema.index({ city: 1, area: 1, rent: 1 });
module.exports = mongoose.model('Listing', listingSchema);
