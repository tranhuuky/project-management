const Cart = require("../../models/carts.model")
const Product = require("../../models/product.model")

const productsHelper = require("../../helpers/products");
// [GET]/cart
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId
    })

    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id;
            const productInfo = await Product.findOne({
                _id: productId,

            }).select("title thumbnail slug price discountPercentage");
            productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
            item.productInfo = productInfo;
            const totalPrice = item.quantity * productInfo.priceNew;
            item.totalPrice = totalPrice;
        }
    }
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render("client/pages/cart/index", {
        pageTitle: "Gio hàng ",
        cartDetail: cart
    });
};
// [GET] /cart/add/:productId
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

// [GET]/cart/delete/:productId
module.exports.delete = async (req, res) => {

    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    await Cart.updateOne({
        _id: cartId
    }, {
        $pull: {
            products: {
                product_id: productId
            }
        }
    });


    req.flash('success', 'Xóa sản phẩm khỏi giỏ hàng thành công');

    res.redirect("back");

};
// [GET]/cart/update/:productId/:quantity
module.exports.update = async (req, res) => {

    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.params.quantity);
    await Cart.findOneAndUpdate({
        _id: cartId,
        "products.product_id": productId
    }, {
        $set: {
            "products.$.quantity": quantity
        }
    });
    req.flash('success', 'Cap nhap so luong san pham trong gio hang thanh cong');
    res.redirect("back");

};