const product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");
// [GET]/search
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;
    let newProducts = []
    if (keyword) {
        const reges = new RegExp(keyword, 'i');
        const products = await product.find({
            title: reges,
            deleted: false,
            status: "active"
        });
        console.log(products);
        newProducts = productsHelper.priceNewProducts(products);
    }
    const products = await product.find();
    res.render("client/pages/search/index.pug", {
        pageTitle: "Kết Quar tìm kiếm ",
        keyword: keyword,
        products: newProducts

    });
};