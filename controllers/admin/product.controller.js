const Product = require("../../models/product.model")

const systemConfig = require("../../config/system")
const filterStatusHelpers = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")


//[GET ]/admin/products
module.exports.index = async (req, res) => {
    // console.log(req.query.status);
    // bộ lọc 
    const filterStatus = filterStatusHelpers(req.query);


    let find = {
        deleted: false,
    };
    if (req.query.status) {

        find.status = req.query.status;
    }

    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    // pagination
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countProducts

    );
    // if (req.query.page) {
    //     objectPagination.currentPage = parseInt(req.query.page);
    // }
    // objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;


    // const countProducts = await Product.countDocuments(find);

    // const totalPage = Math.ceil(countProducts / objectPagination.limitItems);
    // objectPagination.totalPage = totalPage;

    //những chô này là dùng để chọc  vào trong model để truy vấn  database thiwf nhưng chở đó pahir dùng await
    // đừng trức thangw model phải thêm thăngd await vào 
    const products = await Product.find(find)
        .sort({ position: "desc" })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    // console.log(products)
    res.render("admin/pages/products/index", {
        pageTitle: "Trang Sản Phẩm  ",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

//[PATCH]/admin/products/change-Status/:status/:id
module.exports.changeStatus = async (req, res) => {

    const status = req.params.status;
    const id = req.params.id;
    // khi nào liên quang đến truy vấn thì mỡ moogo
    await Product.updateOne({ _id: id }, { status: status });
    req.flash('success', 'Cập Nhật Trạng Thái Thành công!');
    res.redirect("back");
}
//[PATCH]/admin/products/change-multi/:status/:id
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length}  sản phầm !`);
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            req.flash('success', `Cập nhật trạng thái thành công cho ${ids.length} sản phầm !`);
            break;
        case "delete-all":
            await Product.updateMany(
                { _id: { $in: ids } },
                {
                    deleted: true,
                    deletedAt: new Date(),
                }
            );
            req.flash('success', `Đâ xóa thành công  ${ids.length} sản phầm !`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                // console.log(id);
                // console.log(position);
                await Product.updateOne({ _id: id }, {
                    position: position
                });
            };
            req.flash('success', ` thay đôi vị trí  của ${ids.length} sản phẩm thành công !`);
            break;

        default:
            break;
    }


    res.redirect("back");

}

//[DELETE]/admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    // xóa vĩnh viễn 
    // await Product.deleteOne({ _id: id });
    await Product.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash('success', `Đâ xóa sản phầm thành công!`);
    res.redirect("back");
}

//[GET ]/admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "thêm mới Sản Phẩm  ",
    });
}
//[POST]/admin/products/create
module.exports.createPost = async (req, res) => {

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position == "") {
        // count đếm số lương bảng ghi 
        const countProduts = await Product.countDocuments();
        req.body.position = countProduts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`)
}
//[GET ]/admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const product = await Product.findOne(find);

        res.render("admin/pages/products/edit", {
            pageTitle: "Sửa sản phấm ",
            product: product
        });

    } catch (error) {
        req.flash('error', ` sản phầm không tồn tại !`);
        res.redirect(`${systemConfig.prefixAdmin}/products`)

    }

}

//[PATCH ]/admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        await Product.updateOne({ _id: id }, req.body);
        req.flash('success', `Cập nhật thành công!`);
    } catch (error) {
        req.flash('error', `Cập nhật thất bại!`);
    }
    res.redirect("back");
}

//[GET ]/admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const product = await Product.findOne(find);
        console.log(product);
        res.render("admin/pages/products/detail", {
            pageTitle: "chi tiết sản phẩm ",
            product: product
        });

    } catch (error) {
        req.flash('error', ` sản phầm không tồn tại !`);
        res.redirect(`${systemConfig.prefixAdmin}/products`)

    }

}