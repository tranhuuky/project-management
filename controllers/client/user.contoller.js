// const User = require('../../models/user.model')
const md5 = require("md5");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const generateRandomNumber = require("../../helpers/generate");
module.exports.register = async (req, res, next) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký Tài khoản",
    });
}
// const User = require('../../models/user.model')

module.exports.registerPost = async (req, res, next) => {
    console.log(req.body);
    const existEmail = await User.findOne({
        email: req.body.email
    })
    if (existEmail) {
        req.flash("error", "Email đã tồn tại")
        res.redirect("back")
        return;
    }
    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");

}
// [GET] /user/login
module.exports.login = async (req, res, next) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập Tài khoản",
    });
}


// [GET] /user/login
module.exports.loginPost = async (req, res, next) => {
    const email = req.body.email;
    const password = md5(req.body.password);
    const user = await User.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        req.flash("error", "Email không tồn tại")
        res.redirect("back")
        return;
    }
    if (user.password != password) {
        req.flash("error", "Mật khẩu không đúng")
        res.redirect("back")
        return;
    }
    if (user.status != "active") {
        req.flash("error", "Tài khoản nay bi khoa")
        res.redirect("back")
        return;
    }
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
}
// [GET] / user / logout
module.exports.logout = async (req, res, next) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
}
// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res, next) => {
    res.render("client/pages/user/forgot-Password", {
        pageTitle: "Quên mật khẩu",
    });
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res, next) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email
    });
    if (!user) {
        req.flash("error", "Email không tồn tại")
        res.redirect("back")
        return;
    }



    const otp = generateRandomNumber.generateRandomNumber(6); // tạo otp
    // lưu thông tin vào db
    const objectForgotPassword = {
        email: req.body.email,
        otp: otp,
        expireAt: Date.now()
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    console.log(objectForgotPassword);

    // nếu email tồn tại thì gửi otp qua email (Viết sau )
}