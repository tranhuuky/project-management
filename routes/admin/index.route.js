const systemCofig = require("../../config/system");
const dashbroadroute = require("./dashbroad.route");
const productsRoutes = require("./product.route");

module.exports = (app) => {
    const PATH_ADMIN = systemCofig.prefixAdmin;
    app.use(PATH_ADMIN + "/dashbroad", dashbroadroute);
    app.use(PATH_ADMIN + "/products", productsRoutes);
} 