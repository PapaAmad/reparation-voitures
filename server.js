const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

mongoose.connect('mongodb://localhost:27017/reparations-voitures', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use('/api/products', productRoutes);
app.use('/api/order', orderRoutes);

app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
