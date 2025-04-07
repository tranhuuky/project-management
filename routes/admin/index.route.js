const systemCofig = require("../../config/system");
const authMiddleware = require("../../middlewares/admin/auth.middlewares");
const dashboardroute = require("./dashboard.route");
const productsRoutes = require("./product.route");
const productsCategoryRoutes = require("./product-category.route");
const roleRoutes = require("./role.router");
const accountRoutes = require("./account.router");
const authRoutes = require("./auth.router");
const myAccountRoutes = require("./my-account.router");
const settingsRouter = require("./setting.router");


module.exports = (app) => {
    const PATH_ADMIN = systemCofig.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard",
        authMiddleware.requireAuth,
        dashboardroute);
    app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productsRoutes);
    app.use(PATH_ADMIN + "/products-category", authMiddleware.requireAuth, productsCategoryRoutes);
    app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRoutes);
    app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoutes);
    app.use(PATH_ADMIN + "/auth", authRoutes);
    app.use(PATH_ADMIN + "/my-account", authMiddleware.requireAuth, myAccountRoutes);
    app.use(PATH_ADMIN + "/settings", authMiddleware.requireAuth, settingsRouter);

} 