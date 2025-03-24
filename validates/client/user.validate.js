
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
