
module.exports.registerPost = async (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", 'vui lòng nhập họ tên ! ');
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req.flash("error", 'vui lòng nhập email ! ');
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req.flash("error", 'vui lòng nhập mật khất ! ');
        res.redirect("back");
        return;
    }

    next();
}

module.exports.loginPost = async (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", 'vui lòng nhập email ! ');
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req.flash("error", 'vui lòng nhập mật khất ! ');
        res.redirect("back");
        return;
    }

    next();
}


module.exports.forgotPasswordPost = async (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", 'vui lòng nhập email ! ');
        res.redirect("back");
        return;
    }



    next();
}
module.exports.resetPasswordPost = async (req, res, next) => {
    if (!req.body.password) {
        req.flash("error", 'vui lòng nhập lai mật khất ! ');
        res.redirect("back");
        return;
    }
    if (!req.body.confirmPassword) {
        req.flash("error", 'vui lòng nhập xác nhận lại mật khẩu  ! ');
        res.redirect("back");
        return;
    }
    if (req.body.password != req.body.confirmPassword) {
        req.flash("error", 'Mật khất không khợp ! ');
        res.redirect("back");
        return;
    }



    next();
}
