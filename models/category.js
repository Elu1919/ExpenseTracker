const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  id: {
    type: Number,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  icon: {
    type: String,
    require: true,
  },
})

module.exports = mongoose.model('Category', categorySchema)