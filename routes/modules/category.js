const express = require('express')
const Record = require('../../models/record')
const Category = require('../../models/category')

const router = express.Router()

router.get('/:id', async (req, res) => {
  try {

    const categoryId = req.params.id
    const userId = req.user._id
    let totalAmount = 0

    const cateBtn = await Category.findOne({ id: categoryId }).lean()

    const recordData = await Record.find({ categoryId, userId }).lean().sort({ date: "desc" })
    const categoryData = await Category.find().lean().sort({ id: "asc" })
    const renderData = await Promise.all((recordData.map(async record => {
      try {
        const category = await Category.findOne({ id: record.categoryId })
        record.cateImg = category.icon

        record.date = record.date.toISOString().slice(0, 10)
        totalAmount += record.amount

        return record

      } catch (error) {
        console.log(error)
      }
    })))
    res.render('index', { renderData, totalAmount, categoryData, cateBtn })

  } catch (error) {
    console.log(error)
  }
})

module.exports = router