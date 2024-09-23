const express = require("express");
const router = express.Router();
const Menu = require("../../models/menu"); // Your Menu model
const Restaurant = require("../../models/restaurants"); // Your Restaurant model

// Endpoint to add menu data and associate it with a restaurant
router.post("/addMenu", async (req, res) => {
  try {
    const { restaurantTitle, menuData } = req.body;

    // Ensure menuData includes restaurantTitle
    const menuPayload = {
      restaurantTitle,
      menuData,
    };

    // Step 1: Create and save the new menu
    const newMenu = new Menu(menuPayload);
    const savedMenu = await newMenu.save();
    console.log("savedMenu", savedMenu);
    // Step 2: Find the restaurant and associate the menuId
    const restaurant = await Restaurant.findOne({
      "restaurants.title": restaurantTitle,
    });

    if (restaurant) {
      // Find the specific restaurant entry in the array
      const restaurantEntry = restaurant.restaurants.find(
        (r) => r.title === restaurantTitle
      );

      if (restaurantEntry) {
        restaurantEntry.menuId = savedMenu._id; // Link menuId to restaurant
        await restaurant.save(); // Save the updated restaurant document
      }

      return res
        .status(200)
        .json({ message: "Menu added and associated successfully!" });
    } else {
      return res.status(404).json({ message: "Restaurant not found!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// router.get("/getRestaurantWithMenu", async (req, res) => {
//   try {
//     const data = await Restaurant.find().populate("restaurants.menuId");
//     return res.status(200).json(data);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

router.get("/getRestaurantWithMenu", async (req, res) => {
  try {
    console.log("req.query", req.query);
    const restaurantName = req.query.query; // Get restaurant name from query params
    console.log("restaurantName", restaurantName);
    // Find the restaurant with the specified name and populate the menuId
    // const data = await Restaurant.findOne({
    //   "restaurants.title": restaurantName,
    // }).populate("restaurants.menuId");
    // console.log("data", data);
    // data.populate("restaurants.menuId");
    const data = await Restaurant.findOne({
      "restaurants.title": restaurantName,
    }).populate("restaurants.menuId");
    
    console.log("data", data);
    

    if (!data) {
      return res.status(404).json({ message: "Restaurant not found!" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
