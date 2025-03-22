const Cart = require("../../models/carts.model")
// [GET]/search
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne(
        {
            _id: cartId
        });
    const existProductInCaert = cart.products.find(item => item.product_id == productId);
    if (existProductInCaert) {
        // ó hai cách để cập nhật số lượng sản phẩm trong giỏ hàng:
        // Cách 1: cập nhật số lượng sản phẩm trong giỏ hàng 
        // thông qua câu lệnh save

        // existProductInCaert.quantity += quantity;
        // await cart.save(); 

        // Cách 2: cập nhật số lượng sản phẩm trong giỏ hàng 
        // thông qua câu lệnh updateOne
        const quantityNew = quantity + existProductInCaert.quantity;

        await Cart.findOneAndUpdate({
            _id: cartId,
            "products.product_id": productId
        }, {
            $set: {
                "products.$.quantity": quantityNew
            }
        });

    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        };
        await Cart.findOneAndUpdate({
            _id: cartId
        }, {
            $push: {
                products: objectCart
            }
        });

    }



    req.flash('success', 'Thêm sản phẩm vào giỏ hàng thành công');
    res.redirect("back");

};