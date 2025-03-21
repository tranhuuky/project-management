const ProductCategory = require("../../models/product-category")
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helpers/createTree")
//[GET ]/admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };


    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);
    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm ",
        records: newRecords
    });
}
//[GET ]/admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }





    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục sản phẩm  ",
        records: newRecords
    });
}
//[POST]/admin/products-category/create
module.exports.createPost = async (req, res) => {

    if (req.body.position == "") {
        // count đếm số lương bảng ghi 
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
}

//[GET ]/admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await ProductCategory.findOne({
            _id: id,
            deleted: false
        });
        const records = await ProductCategory.find({
            deleted: false
        });
        const newRecords = createTreeHelper.tree(records);
        res.render("admin/pages/products-category/edit", {
            pageTitle: "chỉnh sửa danh mục sản phẩm ",
            data: data,
            records: newRecords
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
};

//[PATCH]/admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    // Kiểm tra nếu position là một số hợp lệ trước khi chuyển đổi
    req.body.position = parseInt(req.body.position) || null;

    await ProductCategory.updateOne({ _id: id }, req.body);
    res.redirect("back");

}
//[GET]/admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const productCategory = await ProductCategory.findOne(find);

        res.render("admin/pages/products-category/detail.pug", {
            pageTitle: "chi tiết sản phẩm ",
            productCategory: productCategory
        });

    } catch (error) {
        console.error("Lỗi khi lấy chi tiết danh mục sản phẩm:", error);
        res.redirect("admin/products-category");
    }
}
//[GET]/admin/products-category/delete/:id
module.exports.deleteItemCategory = async (req, res) => {
    const id = req.params.id;

    // xóa vĩnh viễn
    // await Product.deleteOne({ _id: id });
    await ProductCategory.updateOne({ _id: id }, {
        deleted: true,
        // deletedBy: {
        //     account_id: res.locals.user.id,
        //     deletedAt: new Date()
        // }
    });
    req.flash('success', `Đâ xóa danh mục sản phẩm !`);
    res.redirect("back");

}