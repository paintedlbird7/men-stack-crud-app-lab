// models/vegetable.js
// Define your schema

const mongoose = require('mongoose');

const vegetableSchema = new mongoose.Schema({
  name: String,
  isReadyToEat: Boolean,
});

const Vegetable = mongoose.model("Vegetable", vegetableSchema); // create model

module.exports = Vegetable;
// this module exports the vegetable model
// vegetable model provides us with full CRUD functionality over our vegetables collection in the vegetables-app database
