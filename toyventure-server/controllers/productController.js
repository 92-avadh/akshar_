const sendEmail = require('../utils/sendEmail');
const Product = require('../models/Product');

// @desc    Fetch all products with Search, Filter, and Pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const pageSize = Number(req.query.limit) || 12; 
        const page = Number(req.query.page) || 1;

        const keyword = req.query.keyword ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i', 
            },
        } : {};

        const tag = req.query.tag ? { tag: req.query.tag } : {};
        const queryFilter = { ...keyword, ...tag };

        const count = await Product.countDocuments(queryFilter);
        const products = await Product.find(queryFilter)
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({
            products,
            page,
            pages: Math.ceil(count / pageSize),
            totalProducts: count
        });

    } catch (error) {
        console.error("Fetch Products Error:", error);
        res.status(500).json({ message: "Server Error: Could not fetch products" });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Create a Review (Verified Buyers)
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.name.toString() === req.user.name.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ message: 'You have already reviewed this toy.' });
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Review added successfully!' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add review' });
    }
};

// @desc    Delete a Review (Admin Moderation)
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private/Admin
const deleteProductReview = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (product) {
            const reviewIndex = product.reviews.findIndex(r => r._id.toString() === req.params.reviewId);
            
            if (reviewIndex !== -1) {
                product.reviews.splice(reviewIndex, 1);
                product.numReviews = product.reviews.length;
                product.rating = product.reviews.length > 0 
                    ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length 
                    : 0;

                await product.save();
                res.json({ message: 'Review successfully deleted by Admin' });
            } else {
                res.status(404).json({ message: 'Review not found' });
            }
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error handling review deletion' });
    }
};

// ==========================================
// NEW: "Notify Me" Waitlist Feature
// ==========================================

// @desc    Add Email to Product Notify List
// @route   POST /api/products/:id/notify
// @access  Public
const notifyMeWhenAvailable = async (req, res) => {
    try {
        const { email } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            // Check if email is already on the list to avoid duplicates
            if (!product.notifyList.includes(email)) {
                product.notifyList.push(email);
                await product.save();
            }
            res.status(200).json({ message: "You're on the list! We'll alert you when it's back." });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to add to waitlist', error });
    }
};

// ==========================================
// ADMIN ONLY ROUTES
// ==========================================

const createProduct = async (req, res) => {
    try {
        const product = new Product({
            title: 'New Magical Toy',
            price: 0,
            user: req.user._id,
            img: 'https://via.placeholder.com/400x400?text=Upload+Image',
            images: [],
            tag: 'General',
            countInStock: 0,
            numReviews: 0,
            description: 'Enter a magical description here...',
            notifyList: [] // Initialize empty
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create product template', error });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { title, price, description, img, tag, oldPrice, countInStock, images } = req.body; 
        const product = await Product.findById(req.params.id);

        if (product) {
            // DETECT RESTOCK EVENT
            const wasOutOfStock = product.countInStock === 0;
            const isRestocked = countInStock > 0;

            product.title = title ?? product.title;
            product.price = price ?? product.price;
            product.description = description ?? product.description;
            product.tag = tag ?? product.tag;
            product.oldPrice = oldPrice ?? product.oldPrice;
            product.countInStock = countInStock ?? product.countInStock;
            
            if (images && images.length > 0) {
                product.images = images;
                product.img = images[0]; 
            } else {
                product.img = img ?? product.img;
            }

            // ==========================================
            // 🔥 ACTUALLY SEND RESTOCK EMAILS HERE
            // ==========================================
            if (wasOutOfStock && isRestocked && product.notifyList && product.notifyList.length > 0) {
                
                // Get your frontend URL from env, or default to localhost for testing
                const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

                // Send an email to EVERY person on the notify list
                const emailPromises = product.notifyList.map(async (userEmail) => {
                    try {
                        await sendEmail({
                            email: userEmail,
                            subject: `🎉 It's Back! ${product.title} is fully restocked!`,
                            html: `
                                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
                                    <h2 style="color: #18181b;">Great news! 🚀</h2>
                                    <p style="color: #52525b; font-size: 16px; line-height: 1.5;">
                                        You asked us to let you know when the <strong>${product.title}</strong> was back in stock. 
                                        Well, the wait is over! We just added fresh inventory to our store.
                                    </p>
                                    <div style="text-align: center; margin: 30px 0;">
                                        <img src="${product.img}" alt="${product.title}" style="max-width: 250px; border-radius: 10px;" />
                                    </div>
                                    <p style="color: #52525b; font-size: 16px;">Hurry and grab yours before it sells out again!</p>
                                    <div style="text-align: center; margin-top: 30px;">
                                        <a href="${clientUrl}/product/${product._id}" style="background-color: #f97316; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                                            Shop Now
                                        </a>
                                    </div>
                                </div>
                            `
                        });
                    } catch (emailErr) {
                        console.error(`Failed to send email to ${userEmail}:`, emailErr);
                    }
                });

                // Wait for all emails to finish sending
                await Promise.all(emailPromises);

                // Clear the list after successfully sending emails so they don't get spammed next time
                product.notifyList = [];
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update product', error });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product completely removed from store' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product', error });
    }
};

module.exports = { 
    getProducts, 
    getProductById, 
    createProductReview,
    deleteProductReview,
    notifyMeWhenAvailable, // Export new hook
    createProduct, 
    updateProduct, 
    deleteProduct 
};