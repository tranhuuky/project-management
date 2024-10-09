// [GET] / admin/dashbroad
module.exports.dashbroad = (req, res) => {
    res.render("admin/pages/dashbroad/index.pug", {
        pageTitle: "Trang Tổng quan "
    });
}