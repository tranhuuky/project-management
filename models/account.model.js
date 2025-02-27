const mongoose = require("mongoose");
const generate = require("../helpers/generate.js");
const accountschema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        token: {
            type: String,
            default: generate.generateRandomString(10)
        },
        phone: String,
        avatar: String,
        role_id: String,
        status: String,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
);
const Account = mongoose.model('Account', accountschema, "accounts");

module.exports = Account;