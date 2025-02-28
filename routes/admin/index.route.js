const systemCofig = require("../../config/system");
const dashboardroute = require("./dashboard.route");
const productsRoutes = require("./product.route");
const productsCategoryRoutes = require("./product-category.route");
const roleRoutes = require("./role.router");
const accountRoutes = require("./account.router");
const authRoutes = require("./auth.router");

module.exports = (app) => {
    const PATH_ADMIN = systemCofig.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard", dashboardroute);
    app.use(PATH_ADMIN + "/products", productsRoutes);
    app.use(PATH_ADMIN + "/products-category", productsCategoryRoutes);
    app.use(PATH_ADMIN + "/roles", roleRoutes);
    app.use(PATH_ADMIN + "/accounts", accountRoutes);
    app.use(PATH_ADMIN + "/auth", authRoutes);
} 