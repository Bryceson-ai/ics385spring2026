// app.js — Minimal Mongoose example (Week 11)
const mongoose = require("mongoose");
require("dotenv").config(); // Load .env variables
// 1. CONNECT 
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("Connection error:", err));
// 2. SCHEMA 
// Define the shape and rules for a Property document.
const propertySchema = new mongoose.Schema({
name: { type: String, required: true },
island: { type: String, enum: ["Maui","Oahu","Kauai","Big Island"] },
type: { type: String, enum: ["hotel","vacation rental"] },
description: String,
amenities: [String], // array of strings
targetSegment: String,
imageURL: String,
createdAt: { type: Date, default: Date.now }
});
// 3. MODEL 
// Mongoose pluralises "Property" -> "properties" collection.
const Property = mongoose.model("Property", propertySchema);
// 4. CREATE 
async function addProperty() {
const prop = await Property.create({
name: "Wailea Sunset Retreat",
island: "Maui",
type: "hotel",
description: "Oceanfront boutique hotel with volcano views.",
amenities: ["pool", "spa", "free parking"],
targetSegment: "honeymooners"
});
console.log("Saved:", prop._id);
}
// 5. READ 
async function listMauiProperties() {
const results = await Property.find({ island: "Maui" });
console.log(results);
}
addProperty().then(listMauiProperties);