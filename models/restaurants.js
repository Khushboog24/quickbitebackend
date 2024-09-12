const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  restaurants: [
    {
      imageUrl: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      deliveryprice: { type: String, required: true },
      deliveryTime: { type: String, required: true },
      rating: { type: Number, required: true }
    }
  ]
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
