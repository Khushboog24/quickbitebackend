const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Restaurant = require('../../models/restaurants.js'); // Make sure this path is correct


router.post("/saveData", async (req, res) => {
    try {
      console.log('req.body', req.body);
  
      const data = req.body;
  
      // Iterate through each heading group
      for (const element of data) {
        const { heading, restaurants } = element;
  
        // Check if the heading already exists in the database
        let existingRestaurantSet = await Restaurant.findOne({ heading });
  
        if (existingRestaurantSet) {
          // If heading exists, push new restaurants to the existing array
          existingRestaurantSet.restaurants.push(...restaurants);
          await existingRestaurantSet.save();
        } else {
          // If heading does not exist, create a new document
          const newRestaurantSet = new Restaurant({
            heading,
            restaurants
          });
          await newRestaurantSet.save();
        }
      }
  
      return res.status(200).json({ message: "Data saved successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  })

router.get("/getData", async (req, res) => {
  try {
    const data = await Restaurant.find();
    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
