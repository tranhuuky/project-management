const categoryProduct = require("../../models/product-category");
const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");

// [GET] / admin/dashbroad
module.exports.dashboard = async (req, res) => {
    const statistic = {
        categoryProduct: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0,
        },
    };

    //Danh muc san pham
    statistic.categoryProduct.total = await categoryProduct.countDocuments({
        deleted: false,
    });
    statistic.categoryProduct.active = await categoryProduct.countDocuments({
        status: "active",
        deleted: false,
    });
    statistic.categoryProduct.inactive = await categoryProduct.countDocuments({
        status: "inactive",
        deleted: false,
    });

    //San pham
    statistic.product.total = await Product.countDocuments({
        deleted: false,
    });
    statistic.product.active = await Product.countDocuments({
        status: "active",
        deleted: false,
    });
    statistic.product.inactive = await Product.countDocuments({
        status: "inactive",
        deleted: false,
    });
    //Danh sach nguoi admin
    statistic.account.total = await Account.countDocuments({
        deleted: false,
    });
    statistic.account.active = await Account.countDocuments({
        status: "active",
        deleted: false,
    });
    statistic.account.inactive = await Account.countDocuments({
        status: "inactive",
        deleted: false,
    });
    //Danh sach nguoi dung client
    statistic.user.total = await User.countDocuments({
        deleted: false,
    });
    statistic.user.active = await User.countDocuments({
        status: "active",
        deleted: false,
    });
    statistic.user.inactive = await User.countDocuments({
        status: "inactive",
        deleted: false,
    });

    res.render("admin/pages/dashbroad/index.pug", {
        pageTitle: "Trang Tổng quan ",
        statistic: statistic
    });
}