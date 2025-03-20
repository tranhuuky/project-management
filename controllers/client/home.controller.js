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
    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);
    // hết lấy ra sản phẩm nổi bật 

    // hiển thij sản phẩm mới nhất 

    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({ position: "desc" }).limit(6);


    const newProductsNew = productsHelper.priceNewProducts(productsNew);
    // hết hiển thij sản phẩm mới nhất
    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang Chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    });
}