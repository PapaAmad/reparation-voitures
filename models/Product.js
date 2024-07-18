const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nom: String,
    description: String,
    prix: Number,
    image: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
