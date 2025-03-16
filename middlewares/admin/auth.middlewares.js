const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemCofig = require("../../config/system");

module.exports.requireAuth = async (req, res, next) => {

    if (!req.cookies.token) {
        res.redirect(`${systemCofig.prefixAdmin}/auth/login`);
    } else {

        const user = await Account.findOne({ token: req.cookies.token }).select("-password");
        if (!user) {
            res.redirect(`${systemCofig.prefixAdmin}/auth/login`);
        } else {
            const role = await Role.findOne({
                _id: user.role_id,
                deleted: false,
            }).select("title permissions");
            res.locals.user = user;
            res.locals.role = role;
            next();
        }


    };

}