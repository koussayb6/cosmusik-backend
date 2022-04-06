const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const passport = require("passport");
const {Strategy: FacebookStrategy} = require("passport-facebook");
const User = require("./models/userModel");
const port = process.env.PORT || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/users', require('./routes/userRoute'))

passport.use(new FacebookStrategy({
        clientID: process.env.FB_CLIENT_ID,
        clientSecret: process.env.FB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    function(accessToken, refreshToken, profile, cb) {
        User.create({ facebookId: profile.id, name: profile.displayName, email: profile.email }, function (err, user) {
            return cb(err, user);
        });
    }
));
app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.send(req.user.facebookId);
    });

// Serve frontend
/*if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  )
} else {
  app.get('/', (req, res) => res.send('Please set to production'))
}*/

app.listen(port, () => console.log(`Server started on port ${port}`))
