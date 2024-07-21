import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

const router = express.Router();

const productSchema = new mongoose.Schema({
    nom: String,
    description: String,
    prix: Number,
    image: String
});

const Product = mongoose.model('Product', productSchema);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/add', upload.single('image'), async (req, res) => {
    const { nom, description, prix } = req.body;
    const image = req.file ? req.file.filename : '';

    try {
        const newProduct = new Product({ nom, description, prix, image });
        await newProduct.save();
        res.status(201).send('Produit ajouté avec succès');
    } catch (error) {
        res.status(500).send('Erreur lors de l\'ajout du produit');
    }
});

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des produits');
    }
});

export default router;
