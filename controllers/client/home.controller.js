const Product = require("../../models/product.model")
const productsHelper = require("../../helpers/products")
// [GET] /
module.exports.index = async (req, res) => {
    // lấy ra sản phẩm nổi bật 
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(6);
    const newProducts = productsHelper.priceNewProducts(productsFeatured);
    // hết lấy ra sản phẩm nổi bật 
    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang Chủ",
        productsFeatured: newProducts

    });
}