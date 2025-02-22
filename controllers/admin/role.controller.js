const Role = require("../../models/role.model")
const systemConfig = require("../../config/system")
// [GET] / admin/role
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };
    const records = await Role.find(find);

    res.render("admin/pages/roles/index.pug", {
        pageTitle: " Nhóm quyên ",
        records: records,
    });
}

// [GET] / admin/role/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create.pug", {
        pageTitle: " tạo nhóm quyền  ",

    });
}
// [POST] / admin/role/create
module.exports.createPost = async (req, res) => {

    const record = new Role(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] / admin/role/edit/id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        let find = {
            _id: id,
            deleted: false
        }
        const data = await Role.findOne(find);
        res.render("admin/pages/roles/edit.pug", {
            pageTitle: " sửa Nhóm quyên ",
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}
// [PATCH] / admin/role/edit/id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.updateOne({ _id: id }, req.body);
        req.flash('success', `Cập nhật thành cong!`);
    }
    catch (error) {
        req.flash('error', `Cập nhật that bai!`);
    }

    res.redirect("back");

}

// [GET] / admin/role/permissions
module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await Role.find(find);
    res.render("admin/pages/roles/permissions.pug", {
        pageTitle: " phan quyen ",
        records: records
    });
}

// [PATCH] / admin/role/permissions
module.exports.permissionsPatch = async (req, res) => {
    try {
        const permissions = JSON.parse(req.body.permissions);
        console.log(permissions);
        for (const item of permissions) {
            await Role.updateOne({ _id: item.id }, {
                permissions: item.permissions
            });
        }
        req.flash('success', `Cap nhap thanh cong`);
        res.redirect(`back`);
    } catch (error) {
        req.flash('error', `Cap nhap that bai`);
        res.redirect(`back`);
    }

}