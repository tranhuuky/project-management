import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// CLIEN_SEND_MESSAGE

const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content);
            e.target.elements.content.value = "";
        }
    })
}

// end of CLIENT_SEND_MESSAGE


// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");

    const div = document.createElement("div");
    let htmlFullName = "";
    if (myId == data.userId) {
        div.classList.add("inner-outgoing")
    } else {
        htmlFullName = `<div class="inner-name" >${data.fullName}</div>`
        div.classList.add("inner-incoming")
    }

    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content" >${data.content}</div>
    `;
    body.appendChild(div);


    body.scrollTop = body.scrollHeight;

});
// END SERVER_RETURN_MESSAGE
// scroll chat to bottom
document.addEventListener("DOMContentLoaded", () => {
    const bodyChat = document.querySelector(".chat .inner-body");
    if (bodyChat) {
        bodyChat.scrollTop = bodyChat.scrollHeight;
    }
});

//end  scroll chat to bottom

// show Icon Chat nhớ là frondend 
const toggleBtn = document.querySelector('#toggle-emoji');
const tooltip = document.querySelector('#emoji-tooltip');
const input = document.querySelector('input[name="content"]');
const picker = document.querySelector('emoji-picker');

// Tạo Popper tooltip
const popperInstance = Popper.createPopper(toggleBtn, tooltip, {
    placement: 'top-end',
    modifiers: [
        {
            name: 'offset',
            options: {
                offset: [0, 10],
            },
        },
    ],
});

// Toggle emoji picker
toggleBtn.addEventListener('click', () => {
    tooltip.classList.toggle('shown');
});

// Khi chọn emoji thì chèn vào input
picker.addEventListener('emoji-click', (event) => {
    input.value += event.detail.unicode;
    tooltip.classList.remove('shown');
});

//end  show Icon Chat nhớ là frondend 