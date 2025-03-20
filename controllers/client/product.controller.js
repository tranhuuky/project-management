const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category")
const productsHelper = require("../../helpers/products")
const productsCategoryhelper = require("../../helpers/product-category")
// [GET] /admin.products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });
    const newProducts = productsHelper.priceNewProducts(products);

    res.render("client/pages/products/index.pug", {
        pageTitle: "Danh Sách sản phẩm ",
        products: newProducts,
    });
}
//[GET] /product/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active"

        };
        const product = await Product.findOne(find);
        console.log(product);
        if (product.product_category_id) {
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false

            });
            product.category = category
        }
        product.priceNew = productsHelper.priceNewProduct(product);
        res.render("client/pages/products/detail", {
            pageTitle: "chi tiết sản phẩm ",
            product: product

        });

    } catch (error) {
        req.flash('error', ` sản phầm không tồn tại !`);
        res.redirect(`/products`)

    }
}
//[GET] /product/:slugCategory
module.exports.category = async (req, res) => {
    try {
        console.log(req.params.slugCategory);
        const category = await ProductCategory.findOne({
            slug: req.params.slugCategory,
            status: "active",
            deleted: false
        });

        const listSubCategory = await productsCategoryhelper.getSubCategory(category.id);
        const listSubCategoryId = listSubCategory.map((item) => item.id);
        const products = await Product.find({
            deleted: false,
            product_category_id: { $in: [category.id, ...listSubCategoryId] }
        }).sort({ position: "desc" });
        const newProducts = productsHelper.priceNewProducts(products);
        res.render("client/pages/products/index.pug", {
            pageTitle: category.title,
            products: newProducts,
        });
    }
    catch (error) {
        console.log(error);

    }
}