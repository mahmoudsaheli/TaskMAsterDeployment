require('dotenv').config()
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const hbs = require('hbs')
const Task = require('./models/Task'); 


const app = express()


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB error:', err))


require('./config/passport')


app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

const flash = require('connect-flash');

app.use(flash());


app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
hbs.registerHelper('ifCond', function(v1, v2, options) {
  return (v1 === v2) ? options.fn(this) : options.inverse(this)
})


const indexRouter = require('./routes/index')
const tasksRouter = require('./routes/tasks')
app.use('/', indexRouter)
app.use('/tasks', tasksRouter)
const accountRouter = require('./routes/account');
app.use('/account', accountRouter);



app.use(function(req, res, next) {
  next(createError(404))
})
app.use(function(err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});


hbs.registerPartials(path.join(__dirname, 'views', 'partials'));




app.post('/account/delete', async (req, res) => {
  try {
    if (!req.user) return res.redirect('/login'); // auth check

    await User.findByIdAndDelete(req.user._id);
    req.logout(() => {
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



app.get('/tasks/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const tasks = await Task.find({
      $text: { $search: query }
    });

    res.render('search', { tasks, query });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).send('Server error');
  }
});

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});




