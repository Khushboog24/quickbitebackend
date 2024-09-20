const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  restaurantTitle: { type: String, required: true }, // Include this line
  menuData: [
    {
      heading: { type: String, required: true },
      toppings: [
        {
          name: { type: String, required: true },
          price: { type: String, required: true },
          checked: { type: Boolean, required: true },
          isPopular: { type: Boolean, required: true },
        },
      ],
      menuItems: [
        {
          name: { type: String, required: true },
          desc: { type: String, required: true },
          price: { type: String, required: true },
          isPopular: { type: Boolean, required: true },
          image: { type: String, required: true },
        },
      ],
    },
  ],
});

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
