const createError = require('http-errors');
const express = require('express');
const path = require('path');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const mongoose = require('mongoose');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongodb-session')(session);

const initPassport = require('./utils/passport-config');
const isAuthMiddleware = require('./middleware/isAuthMiddleware');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

require('dotenv').config();

let app = express();

// setup handlebars
const hbs = exphbs.create({
  defaultLayout: 'layout',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.use(bodyParser.urlencoded({
  extended: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to Database...'));

// Store session inside the MongoDB
const store = new MongoStore({
  uri: process.env.MONGODB_HOST,
  collection: 'sessions'
});

// view engine setup
app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

app.use(flash());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use(csrf({ cookie: true }));

initPassport(passport);
app.use(passport.initialize(undefined));
app.use(passport.session(undefined));

app.use(isAuthMiddleware);

// Routers
app.use('/', indexRouter);
app.use('/', userRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.disable('x-powered-by');

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
