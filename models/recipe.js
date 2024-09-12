import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    ingredients: { type: [String], required: true },
    method: { type: [String], required: true },
});

const Recipe = mongoose.model('recipes', recipeSchema);

export default Recipe;