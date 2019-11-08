var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session')
const passport = require('passport')

/* --- V7: Using dotenv     --- */
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

/* --- V2: Adding Web Pages --- */
var aboutRouter = require('./routes/about');
var restaurantsRouter = require('./routes/restaurants');
var historyRouter = require('./routes/history');
var workersRouter = require('./routes/workers');
var rewardsRouter = require('./routes/rewards');
var myRestaurantsRouter = require('./routes/my_restaurants');
var myRestaurantsReservationRouter = require('./routes/my_restaurants_reser');
var favouritesRouter = require('./routes/favourites');
var restaurant_infoRouter = require('./routes/restaurant_info');
/* ---------------------------- */

/* --- V3: Basic Template   --- */
var tableRouter = require('./routes/table');
var loopsRouter = require('./routes/loops');
/* ---------------------------- */

/* --- V4: Database Connect --- */
var selectRouter = require('./routes/select');
/* ---------------------------- */

/* --- V5: Adding Forms     --- */
var formsRouter = require('./routes/forms');
/* ---------------------------- */

/* --- V6: Modify Database  --- */
var insertRouter = require('./routes/insert');
/* ---------------------------- */

var app = express();

app.use(session({
    secret: process.env.SECRET || 'secret',
    resave: true,
    saveUninitialized: true
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/public/stylesheets', express.static('public/stylesheets'));


app.use(passport.initialize())
app.use(passport.session())

// Authentication Setup
require('./auth').init(app);
require('./routes/auth')(app);
//require('./routes/init')(app);

app.use('/', indexRouter);
app.use('/users', usersRouter);

/* --- V2: Adding Web Pages --- */
app.use('/about', aboutRouter);
app.use('/history', historyRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/rewards', rewardsRouter);
app.use('/favourites', favouritesRouter);
app.use('/restaurant_info', restaurant_infoRouter);
app.use('/my_restaurants', passport.authMiddleware(['Owner']), myRestaurantsRouter);
app.use('/my_restaurants/reservation', passport.authMiddleware(['Owner']), myRestaurantsReservationRouter);
app.use('/workers', workersRouter);
/* ---------------------------- */

/* --- V3: Basic Template   --- */
app.use('/table', tableRouter);
app.use('/loops', loopsRouter);
/* ---------------------------- */

/* --- V4: Database Connect --- */
app.use('/select', selectRouter);
/* ---------------------------- */

app.get('/home', function(req, res, next) {
    res.render('home', { title: 'Home', auth: true, data:[{name: "a", address: "a", area: "b", openHour: "8:00", hasPromotion: true}] });
});

/* --- V5: Adding Forms     --- */
app.use('/forms', formsRouter);
/* ---------------------------- */

/* --- V6: Modify Database  --- */
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/insert', insertRouter);
/* ---------------------------- */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;