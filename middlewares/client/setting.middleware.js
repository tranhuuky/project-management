const SettingGeneral = require('../../models/settingGeneral.model');

module.exports.setting = async (req, res, next) => {
    const settingGeneral = await SettingGeneral.findOne({});

    res.locals.settingGeneral = settingGeneral;

    next();
}