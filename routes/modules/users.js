const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')

const router = express.Router()

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const errors = []

    // 檢查是否所有欄位都有填寫
    if (!name || !email || !password || !confirmPassword) {
      errors.push({ message: '所有欄位都是必填！' })
    }
    // 檢查密碼是否一致
    if (password !== confirmPassword) {
      errors.push({ message: '密碼輸入不一致！' })
    }
    // 若表單填寫有誤 >>> 註冊頁顯示錯誤訊息
    if (errors.length) {
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }

    // 若表單填寫正確 >>> 傳入資料
    const user = await User.findOne({ email })

    // 檢查電子信箱是否已註冊
    // 已註冊 >>> 註冊頁顯示錯誤訊息
    if (user) {
      errors.push({ message: '這個電子信箱已經註冊過囉！' })
      res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })

    } else {
      // 未註冊 >> 將資料寫入資料庫
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      await User.create({
        name,
        email,
        password: hash
      })
      res.redirect('/')
    }

  } catch (error) {
    console.log(error)
  }
})

router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err)
    }
    req.flash('success_msg', '登出成功！')
    res.redirect('/users/login')
  })
})

module.exports = router