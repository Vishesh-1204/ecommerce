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

// ---------------- DATA ----------------

let products = [
    { id: 1, name: "Laptop", price: 50000 },
    { id: 2, name: "Mobile", price: 20000 }
];

let users = [
    { id: 1, name: "Rahul", email: "rahul@gmail.com" },
    { id: 2, name: "Priya", email: "priya@gmail.com" }
];

let cart = [
    { id: 1, product: "Laptop", quantity: 1 }
];

let orders = [
    { id: 1, product: "Mobile", status: "Placed" }
];

// ---------------- ROUTES ----------------

// PRODUCTS
app.get('/products', (req, res, next) => {
    try {
        res.json(products);
    } catch (error) {
        next(error);
    }
});

app.post('/products',
    validateFields(['id', 'name', 'price']),
    (req, res, next) => {
        try {
            const product = req.body;
            products.push(product);
            res.status(201).json({
                message: "Product added successfully",
                product
            });
        } catch (error) {
            next(error);
        }
    }
);

// USERS
app.get('/users', (req, res, next) => {
    try {
        res.json(users);
    } catch (error) {
        next(error);
    }
});

app.post('/users',
    validateFields(['id', 'name', 'email']),
    (req, res, next) => {
        try {
            const user = req.body;
            users.push(user);
            res.status(201).json({
                message: "User added successfully",
                user
            });
        } catch (error) {
            next(error);
        }
    }
);

// CART
app.get('/cart', (req, res, next) => {
    try {
        res.json(cart);
    } catch (error) {
        next(error);
    }
});

app.post('/cart',
    validateFields(['id', 'product', 'quantity']),
    (req, res, next) => {
        try {
            const item = req.body;
            cart.push(item);
            res.status(201).json({
                message: "Item added to cart",
                item
            });
        } catch (error) {
            next(error);
        }
    }
);

// ORDERS
app.get('/orders', (req, res, next) => {
    try {
        res.json(orders);
    } catch (error) {
        next(error);
    }
});

app.post('/orders',
    validateFields(['id', 'product', 'status']),
    (req, res, next) => {
        try {
            const order = req.body;
            orders.push(order);
            res.status(201).json({
                message: "Order placed successfully",
                order
            });
        } catch (error) {
            next(error);
        }
    }
);

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
