const express = require('express');

const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

require('dotenv').config()

const database = require("./config/database")

const systemConfig = require("./config/system")

const routeAdmin = require("./routes/admin/index.route")
const route = require("./routes/client/index.route")


database.connect();

const app = express();
const port = process.env.PORT;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// flash
app.use(cookieParser('KHJHDHDJDJDJD'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// end flash


app.use(methodOverride("_method"));

app.set("views", `${__dirname}/views`);
app.set('view engine', 'pug');

// App locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`));

// routes
routeAdmin(app);
route(app);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});