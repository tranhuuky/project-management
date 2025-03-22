const Cart = require('../../models/carts.model');
module.exports.cartId = async (req, res, next) => {
    console.log(req.cookies.cartId);
    if (!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();
        console.log(cart);
        const expiresCookis = 365 * 24 * 60 * 60 * 1000;
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresCookis),
        })
        // tạo giỏ hàng mới
    } else {
        // lấy ra giỏ hàng cũ
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        });
        cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
        res.locals.miniCart = cart;


    }
    next();

}