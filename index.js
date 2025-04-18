const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const moment = require('moment');
const { createServer } = require('node:http');
const { Server } = require('socket.io');



require('dotenv').config()

const database = require("./config/database")

const systemConfig = require("./config/system")

const routeAdmin = require("./routes/admin/index.route")
const route = require("./routes/client/index.route")


database.connect();

const app = express();
const port = process.env.PORT;
//socket io
const server = createServer(app);
const io = new Server(server);

global._io = io;

//end socket io

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// flash
app.use(cookieParser('KHJHDHDJDJDJD'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// end flash

// tinyMCE

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//end  tinyMCE

app.use(methodOverride("_method"));

app.set("views", `${__dirname}/views`);
app.set('view engine', 'pug');

// App locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

// routes
routeAdmin(app);
route(app);
app.get("*", (req, res) => {
    res.render("client/pages/errors/404", {
        title: "404 Not Found",

    });

});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});