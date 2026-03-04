const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/practicalDB")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const Order = require("./models/order");

const express = require('express');
const app = express();

app.use(express.json());

// ---------------- MIDDLEWARE ----------------

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Validation Middleware
const validateFields = (requiredFields) => {
    return (req, res, next) => {
        for (let field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    error: `${field} is required`
                });
            }
        }
        next();
    };
};

// ---------------- ROUTES ----------------

// PRODUCTS
// PRODUCTS
app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.get('/products/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
});

app.post('/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
});

app.put('/products/:id', async (req, res) => {
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updatedProduct);
});

app.delete('/products/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
});

// USERS
// USERS
app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});

app.post('/users', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
});

app.put('/users/:id', async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updatedUser);
});

app.delete('/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
});
// CART
app.get('/cart', async (req, res) => {
    const items = await Cart.find();
    res.json(items);
});

app.get('/cart/:id', async (req, res) => {
    const item = await Cart.findById(req.params.id);
    res.json(item);
});

app.post('/cart', async (req, res) => {
    const item = new Cart(req.body);
    await item.save();
    res.status(201).json(item);
});

app.put('/cart/:id', async (req, res) => {
    const updatedItem = await Cart.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updatedItem);
});

app.delete('/cart/:id', async (req, res) => {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Cart item deleted successfully" });
});
// ORDERS
app.get('/orders', async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

app.get('/orders/:id', async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.json(order);
});

app.post('/orders', async (req, res) => {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
});

app.put('/orders/:id', async (req, res) => {
    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updatedOrder);
});

app.delete('/orders/:id', async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
});
// ---------------- 404 HANDLER ----------------

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// ---------------- GLOBAL ERROR HANDLER ----------------

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Something went wrong on the server"
    });
});

// ---------------- SERVER ----------------

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
