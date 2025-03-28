const md5 = require('md5');
const Account = require("../../models/account.model")
const systemConfig = require("../../config/system")

// [GET] / admin/auth/login
module.exports.login = (req, res) => {
    if (req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } else {
        res.render("admin/pages/auth/login", {
            pageTitle: "Trang đăng Nhập  "
        });
    }

}

// [POST] / admin/auth/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({ email: email, deleted: false });
    if (!user) {
        req.flash("error", "email không đúng");
        res.redirect("back");
        return;
    }

    if (md5(password) != user.password) {
        req.flash("error", "Mật khẩu khong dung");
        res.redirect("back");
        return;
    }
    if (user.status != "active") {
        req.flash("error", "Tài khoản nay bi khoa");
        res.redirect("back");
        return;
    }

    res.cookie("token", user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

// [GET] / admin/auth/logoutout
module.exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}