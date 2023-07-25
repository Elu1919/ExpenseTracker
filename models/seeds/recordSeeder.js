if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')

const RecordModel = require('../record')
const CategoryModel = require('../category')
const UserModel = require('../user')

const recordList = require('../record.json').results
const SEED_USER = require('../users.json').results

const bcrypt = require('bcryptjs')

db.once('open', async () => {

  try {
    await Promise.all(

      SEED_USER.map(async (user) => {

        try {

          const salt = await bcrypt.genSalt(10)
          const hash = await bcrypt.hash(user.password, salt)

          const createdUser = await UserModel.create({
            name: user.name,
            email: user.email,
            password: hash
          })
          console.log('user created')

          const userRecord = []

          recordList.forEach((record) => {
            if (user.id === record.userId) {
              record.userId = createdUser._id
              userRecord.push(record)
            }
          })

          await RecordModel.create(userRecord)
          console.log('record created!')

        } catch {
          console.log(error)
        }

      })

    )

  } catch {
    console.log(error)

  } finally {
    console.log('done!')
    process.exit()

  }

})

