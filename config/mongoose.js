const mongoose = require('mongoose')

// setting dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// connect mongoDB
mongoose.connect(process.env.MONGODB_URI)

// get the connection status of mongoDB
const db = mongoose.connection

// Connection failed
db.on('error', () => {
  console.log('mongodb error!')
})

// successfully connected
db.once('open', () => {
  console.log('mongodb connected!')
})

module.exports = db