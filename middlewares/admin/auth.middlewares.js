const Account = require("../../models/account.model");
const systemCofig = require("../../config/system");

module.exports.requireAuth = async (req, res, next) => {

    if (!req.cookies.token) {
        res.redirect(`${systemCofig.prefixAdmin}/auth/login`);
    } else {

        const user = await Account.findOne({ token: req.cookies.token });
        if (!user) {
            res.redirect(`${systemCofig.prefixAdmin}/auth/login`);
        } else {
            next();
        }


    };

}