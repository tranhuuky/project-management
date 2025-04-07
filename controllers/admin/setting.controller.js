const SettingGeneral = require("../../models/settingGeneral.model");
// [GET] /admin/settings
module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});

    res.render("admin/pages/settings/general", {
        pageTitle: "Thống tín chính",
        settingGeneral: settingGeneral
    });
}
// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});
    if (settingGeneral) {
        await SettingGeneral.updateOne(
            {
                _id: settingGeneral._id

            },
            req.body
        );
    } else {
        const record = new SettingGeneral(req.body);
        await record.save();
    }


    res.redirect("back");

}