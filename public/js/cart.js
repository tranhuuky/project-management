// cập nhật số lượng sản phẩm trong giỏ hàng thông qua câu lệnh updateOne
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if (inputsQuantity.length > 0) {
    inputsQuantity.forEach(input => {
        input.addEventListener("change", () => {
            const productId = input.getAttribute("productId-id");
            const quantity = input.value;
            window.location.href = `/cart/update/${productId}/${quantity}`;
        });
    });
}


// end  cập nhật số lượng sản phẩm trong giỏ hàng thông qua câu lệnh updateOne