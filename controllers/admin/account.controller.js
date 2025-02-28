// mã hóa password thi dung thử viện  md5 npm 
const md5 = require('md5');

const Account = require("../../models/account.model")
const Role = require("../../models/role.model")

const systemConfig = require("../../config/system")
// [GET] / admin/account
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };

    const records = await Account.find(find).select("-password -token");
    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false,
        });
        record.role = role;
    }
    res.render("admin/pages/accounts/index.pug", {
        pageTitle: " Nhóm quyên ",
        records: records,
    });
};
// [GET] / admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    });
    res.render("admin/pages/accounts/create.pug", {
        pageTitle: " tao tai khoan  ",
        roles: roles
    });
}

// [POST] / admin/accounts/create
module.exports.createPost = async (req, res) => {
    const emailExit = await Account.findOne({ email: req.body.email, deleted: false });
    if (emailExit) {
        req.flash("error", "email nay da ton tai");
        res.redirect("back");
        return;
    } else {
        req.body.password = md5(req.body.password);
        const record = new Account(req.body);
        await record.save();
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }

};

// [GET] / admin/accounts/edit
module.exports.edit = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false,
    }
    try {
        const data = await Account.findOne(find);
        const roles = await Role.find({
            deleted: false
        });
        res.render("admin/pages/accounts/edit.pug", {
            pageTitle: " chinh sua tai khoan ",
            data: data,
            roles: roles

        });
    }
    catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }

}

// [PATCHTCH] / admin/accounts/edit
module.exports.editPatch = async (req, res) => {
    const emailExit = await Account.findOne({
        _id: { $ne: req.params.id },
        email: req.body.email,
        deleted: false,

    });
    const id = req.params.id;
    if (emailExit) {
        req.flash("error", "email nay da ton tai");
        res.redirect("back");
        return;
    } else {
        if (req.body.password) {
        } else {
            delete req.body.password;
        }
        await Account.updateOne({ _id: id }, req.body);
        req.flash("success", "cap nhap thanh cong");
        res.redirect(`back`);
    }

}







