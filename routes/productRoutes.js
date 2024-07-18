const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/Product');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/add', upload.single('image'), async (req, res) => {
    const { nom, description, prix } = req.body;
    const image = req.file ? req.file.filename : '';

    const newProduct = new Product({ nom, description, prix, image });

    try {
        await newProduct.save();
        res.status(201).send('Produit ajouté avec succès');
    } catch (err) {
        res.status(400).send('Erreur lors de l\'ajout du produit');
    }
});

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(400).send('Erreur lors de la récupération des produits');
    }
});

module.exports = router;
