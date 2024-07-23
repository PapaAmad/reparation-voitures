import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import productRoutes from './routes/productRoutes.mjs';
import orderRoutes from './routes/orderRoutes.mjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/order', orderRoutes);

// Static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

export default app;

// niangpapaamadou88
// gvCtAdq5pQYcGhcA
// Your current IP address (154.125.42.163
// mongodb+srv://niangpapaamadou88:gvCtAdq5pQYcGhcA@cluster0.digu4p0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0