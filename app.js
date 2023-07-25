require('./config/mongoose')
const routes = require('./routes')
const usePassPort = require('./config/passport')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')

const express = require('express')
const app = express()
const port = 3000


// setting express-handlebars
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// setting body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// setting express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// use passport
usePassPort(app)

// use flash
app.use(flash())

// res.user
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  //flash
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')

  next()
})

// use method-override
app.use(methodOverride('_method'))

//setting routes
app.use(routes)


app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})