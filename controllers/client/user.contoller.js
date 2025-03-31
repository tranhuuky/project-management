// const User = require('../../models/user.model')
const md5 = require("md5");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgotPassword.model");
const Cart = require("../../models/carts.model");
const generateRandomNumber = require("../../helpers/generate");
const sendMailHelpers = require("../../helpers/sendMail");
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


// [POST] /user/login
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
    const cart = await Cart.findOne({
        user_id: user.id
    });
    if (cart) {
        res.cookie("cartId", cart.id);
    } else {
        await Cart.updateOne({
            _id: req.cookies.cartId
        }, {
            user_id: user.id
        });
    }

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
}
// [GET] / user / logout
module.exports.logout = async (req, res, next) => {
    res.clearCookie("tokenUser");
    res.clearCookie("cartId");
    res.redirect("/");
}
// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res, next) => {
    res.render("client/pages/user/forgot.password.pug", {
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



    // nếu email tồn tại thì gửi otp qua email (Viết sau )

    const subject = "🔐 Mã OTP Xác Minh Khôi Phục Mật Khẩu";

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #007bff; text-align: center;">Xác Minh OTP</h2>
        <p>Chào bạn,</p>
        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng sử dụng mã OTP dưới đây để tiếp tục:</p>
        <div style="text-align: center; font-size: 24px; font-weight: bold; color: #ff4c4c; padding: 10px; border: 2px dashed #ff4c4c; display: inline-block; margin: 10px auto;">
        ${otp}
        </div>
        <p>Mã OTP sẽ hết hạn vào: <b>5 sau phút sử dụng</b></p>
        <p style="color: red; font-weight: bold;">Không chia sẻ mã này với bất kỳ ai!</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="text-align: center; font-size: 12px; color: #777;">&copy; 2025 Hệ Thống Bảo Mật. Mọi quyền được bảo lưu.</p>
    </div>
    `;


    sendMailHelpers.sendMail(email, subject, html);


    res.redirect(`/user/password/otp?email=${email}`);
}
// [GET] /user/password/otp
module.exports.otpPassword = async (req, res, next) => {
    const email = req.query.email;
    res.render("client/pages/user/otp.password.pug", {
        pageTitle: "Nhập ma otp",
        email: email
    });
}

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res, next) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp,

    });
    if (!result) {
        req.flash("error", "OTP Không đúng hoặc đã hết hạn");
        res.redirect("back");
        return;
    }
    const user = await User.findOne({
        email: email
    });
    res.cookie("tokenUser", user.tokenUser);
    res.redirect(`/user/password/reset`);

}

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res, next) => {
    res.render("client/pages/user/reset.password.pug", {
        pageTitle: "Đăng ký Lại mật khất ",
    });
}

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res, next) => {
    const password = md5(req.body.password);
    const tokenUser = req.cookies.tokenUser;
    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: password
    })


    res.redirect("/");
}
// [GET] /user/info
module.exports.info = async (req, res) => {
    res.render("client/pages/user/info", {
        pageTitle: "Thống tin tài khoản",
    });
}

