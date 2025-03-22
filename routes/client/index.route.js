const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")
const homeRoutes = require("./home.route")
const productRoutes = require("./products.route");
const searchRoutes = require("./search.router");
const cartRoutes = require("./cart.router");

module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use('/', homeRoutes);
    app.use('/products', productRoutes);
    app.use('/search', searchRoutes);
    app.use('/cart', cartRoutes);
} 