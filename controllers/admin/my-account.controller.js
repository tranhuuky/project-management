const md5 = require('md5');
const Account = require("../../models/account.model")
const systemConfig = require("../../config/system")
module.exports.index = (req, res) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "Tạo tài khoản ",
    });
}


module.exports.edit = (req, res) => {
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Tạo tài khoản ",
    });
}

module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id;
    const emailExit = await Account.findOne({
        _id: { $ne: res.locals.user.id },
        email: req.body.email,
        deleted: false,

    });

    if (emailExit) {
        req.flash("error", "email nay da ton tai");
        res.redirect("back");
        return;
    } else {
        if (req.body.password) {
            req.body.password = md5(req.body.password);

        } else {
            delete req.body.password;
        }
        await Account.updateOne({ _id: id }, req.body);
        req.flash("success", "cap nhap thanh cong");
        res.redirect(`back`);
    }


}