const Product = require("../../models/product.model")
const Account = require("../../models/account.model")
const systemConfig = require("../../config/system")
const filterStatusHelpers = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const ProductCategory = require("../../models/product-category")
const createTreeHelper = require("../../helpers/createTree")


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
    let sort = {};
    if (req.query.sortKey && req.query.sortValua) {
        sort[req.query.sortKey] = req.query.sortValua;
    } else {
        sort.position = "desc";
    }
    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    for (const product of products) {
        //lấy ra thông tin người tạo 
        const user = await Account.findOne({ _id: product.createdBy.account_id });
        if (user) {
            product.accountFullName = user.fullName;
        }
        //lấy ra thông tin ngươì cặp nhật gần nhất 

        const updatedBy = product.updatedBy[product.updatedBy.length - 1];
        if (updatedBy) {
            const userUpdate = await Account.findOne({
                _id: updatedBy.account_id
            });

            updatedBy.accountFullName = userUpdate.fullName;
        }

    }

    // console.log(products)
    res.render("admin/pages/products/index", {
        pageTitle: "Trang Sản Phẩm  ",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}
// end pagination

//[PATCH]/admin/products/change-Status/:status/:id
module.exports.changeStatus = async (req, res) => {

    const status = req.params.status;
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    // khi nào liên quang đến truy vấn thì mỡ moogo
    await Product.updateOne({ _id: id }, {
        status: status,
        $push: { updatedBy: updatedBy }
    });
    req.flash('success', 'Cập Nhật Trạng Thái Thành công!');
    res.redirect("back");
}
//[PATCH]/admin/products/change-multi/:status/:id
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, {
                status: "active",
                $push: { updatedBy: updatedBy }
            });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length}  sản phầm !`);
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, {
                status: "inactive",
                $push: { updatedBy: updatedBy }
            });
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
                    position: position,
                    $push: { updatedBy: updatedBy }
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
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    });
    req.flash('success', `Đâ xóa sản phầm thành công!`);
    res.redirect("back");
}

//[GET ]/admin/products/create
module.exports.create = async (req, res) => {

    let find = {
        deleted: false,
    };


    const category = await ProductCategory.find(find);
    const newCategory = createTreeHelper.tree(category);

    res.render("admin/pages/products/create", {
        pageTitle: "thêm mới Sản Phẩm  ",
        category: newCategory
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
    req.body.createdBy = {
        account_id: res.locals.user.id
    };

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
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }
        await Product.updateOne({ _id: id }, {
            ...req.body,
            $push: { updatedBy: updatedBy }
        });
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