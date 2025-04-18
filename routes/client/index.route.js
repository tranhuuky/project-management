const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")
const userMidelware = require("../../middlewares/client/user.middleware");
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const authMiddleware = require("../../middlewares/client/auth.middlewares")
const homeRoutes = require("./home.route")
const productRoutes = require("./products.route");
const searchRoutes = require("./search.router");
const cartRoutes = require("./cart.router");
const checkoutRoutes = require("./checkout.router");
const userRoutes = require("./user.router");
const chatRoutes = require("./chat.router");

module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use(userMidelware.infoUser);
    app.use(settingMiddleware.setting);
    app.use('/', homeRoutes);
    app.use('/products', productRoutes);
    app.use('/search', searchRoutes);
    app.use('/cart', cartRoutes);
    app.use('/checkout', checkoutRoutes);
    app.use('/user', userRoutes);
    app.use('/chat', authMiddleware.requireAuth, chatRoutes);
} 