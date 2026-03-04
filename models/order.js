const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Order", orderSchema);