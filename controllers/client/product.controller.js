const Product = require("../../models/product.model")
// [GET] /admin.products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });
    const newProducts = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
        return item;
    });

    res.render("client/pages/products/index.pug", {
        pageTitle: "Danh Sách sản phẩm ",
        products: products
    });
}
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"

        };
        const product = await Product.findOne(find);
        console.log(product);
        res.render("client/pages/products/detail", {
            pageTitle: "chi tiết sản phẩm ",
            product: product

        });

    } catch (error) {
        req.flash('error', ` sản phầm không tồn tại !`);
        res.redirect(`/products`)

    }
}