const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')

module.exports = app => {

  // 初始化 Passport 模組
  app.use(passport.initialize()) //初始化
  app.use(passport.session()) // 使用 session

  // 設定 本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: '這個信箱未註冊!' })
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: '電子郵件或密碼輸入錯誤!' })
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))

  // 設定 Facebook 登入
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']

  }, (accessToken, refreshToken, profile, done) => {

    const { name, email } = profile._json

    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }))

  // 設定 序列化、返序列化
  passport.serializeUser((user, done) => {    //序列化 (資料庫 >>> Session)
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {    //反序列化 (Session >>> 資料庫)
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(error => console.log(error, null))
  })
}