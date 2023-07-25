const express = require('express')
const Record = require('../../models/record')
const Category = require('../../models/category')

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const errors = []
    const recordData = req.body
    recordData.userId = req.user._id

    await Record.create(recordData)
    res.redirect('/')

  } catch (error) {
    console.log(error)
  }
})

router.get('/new', (req, res) => {
  res.render('new')
})

router.get('/:id/edit', async (req, res) => {
  try {
    const _id = req.params.id
    const userId = req.user._id
    const recordData = await Record.findOne({ _id, userId }).lean()
    const careData = await Category.findOne({ id: recordData.categoryId }).lean()
    recordData.cateName = careData.name
    recordData.date = new Date(recordData.date).toISOString().slice(0, 10)

    res.render('edit', { recordData })

  } catch (error) {
    console.log(error)
  }
})

router.put('/:id', async (req, res) => {
  try {
    const _id = req.params.id
    const userId = req.user._id
    const data = req.body
    const recordData = await Record.findOne({ _id, userId }).lean()
    data.userId = recordData.userId

    await Record.updateOne({ _id, userId }, data)

    res.redirect('/')

  } catch (error) {
    console.log(error)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const _id = req.params.id
    const userId = req.user._id

    await Record.deleteOne({ _id, userId })

    res.redirect('/')

  } catch (error) {
    console.log(error)
  }
})

module.exports = router