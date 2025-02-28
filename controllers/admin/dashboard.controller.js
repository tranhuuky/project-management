// [GET] / admin/dashbroad
module.exports.dashboard = (req, res) => {
    res.render("admin/pages/dashbroad/index.pug", {
        pageTitle: "Trang Tổng quan "
    });
}