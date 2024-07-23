import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import productRoutes from './routes/productRoutes.mjs';
import orderRoutes from './routes/orderRoutes.mjs';
import dotenv from 'dotenv';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://niangpapaamadou88:gvCtAdq5pQYcGhcA@cluster0.digu4p0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/order', orderRoutes);

// Static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Start server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// niangpapaamadou88
// gvCtAdq5pQYcGhcA
// Your current IP address (154.125.42.163
// mongodb+srv://niangpapaamadou88:gvCtAdq5pQYcGhcA@cluster0.digu4p0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0