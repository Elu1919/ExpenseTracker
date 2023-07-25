if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')

const CategoryModel = require('../category')
const categoryList = require('../category.json').results


db.once('open', async () => {

  try {
    await CategoryModel.create(categoryList)
    console.log('category created')

  } catch {
    console.log(error)

  } finally {
    process.exit()

  }

})