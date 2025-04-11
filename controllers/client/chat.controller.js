const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    //socket.io
    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (content) => {
            // lưu vào db
            const chat = new Chat({
                user_id: userId,
                content: content,
            });
            await chat.save();


            //  TRA DATA VE CLIENT
            _io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: content,

            });
        });
        //Typing 
        socket.on("CLIENT_SEND_TYPING", async (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: fullName,
                type: type
            });
        });
        //end Typing
    });

    // end socket.io

    // lấy data từ db 
    const chats = await Chat.find({
        deleted: false,
    });
    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.user_id,
        }).select("fullName");
        chat.infoUser = infoUser;
    }

    //end  lấy data từ db 
    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats,
    });
}