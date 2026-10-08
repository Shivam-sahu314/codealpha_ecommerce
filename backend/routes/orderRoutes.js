const express = require("express");
const jwt = require("jsonwebtoken");

const Order = require("../models/Order");
const Product = require("../models/Product");

const router = express.Router();


// ===============================
// PLACE ORDER
// ===============================

router.post("/", async (req, res) => {

    try {

        // Token nikalo
        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({
                message: "Please login first"
            });

        }


        // Bearer token
        const token = authHeader.split(" ")[1];


        // Token verify
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        const { products } = req.body;


        if (!products || products.length === 0) {

            return res.status(400).json({
                message: "Cart is empty"
            });

        }


        let totalAmount = 0;

        const orderProducts = [];


        // Cart ke products check karo
        for (const item of products) {

            const product = await Product.findById(
                item.product
            );


            if (!product) {

                return res.status(404).json({
                    message: "Product not found"
                });

            }


            if (product.stock < item.quantity) {

                return res.status(400).json({
                    message: `${product.name} is out of stock`
                });

            }


            totalAmount +=
                product.price * item.quantity;


            orderProducts.push({

                product: product._id,

                quantity: item.quantity

            });


            // Stock reduce
            product.stock -= item.quantity;

            await product.save();

        }


        // Order create
        const order = await Order.create({

            user: decoded.id,

            products: orderProducts,

            totalAmount: totalAmount,

            status: "Pending"

        });


        res.status(201).json({

            message: "Order placed successfully",

            order

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to place order"
        });

    }

});
// ===============================
// GET MY ORDERS
// ===============================

router.get("/my-orders", async (req, res) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({
                message: "Please login first"
            });

        }


        const token = authHeader.split(" ")[1];


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        const orders = await Order.find({
            user: decoded.id
        })
        .populate("products.product")
        .sort({ createdAt: -1 });


        res.json(orders);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to fetch orders"
        });

    }

});

module.exports = router;