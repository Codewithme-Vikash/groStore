const LocalStrategy = require("passport-local");
const { User } = require("./database");


// super user variables
const superUser = "admin.0123456789.!@#$%^&*()";

exports.passportStrategy = (passport) => {
  passport.use(new LocalStrategy(
    async function (username, password, done) {
      try {
        const user =await User.findOne({ username: username }).exec();
        if (!user) { return done(null, false); }
        if (password !== user.password) { return done(null, false); }
        return done(null, user);

      } catch (err) {
        return done(err);
      }
    }
  ));


  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, { id: user.id, username: user.username });
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

};

exports.isAuthenticate = (req, res, next) => {
  if (req.isAuthenticated()) { next() }
  else {
    req.flash("error","you are not loggedIn");
    res.redirect("/")
  }
};

exports.isSuperUser = (req , res, next )=>{
  if( req.isAuthenticated() && (req.user.username === superUser) ){
    next();
  }else{
    res.send("<h1>Error 403 ,Access Denied! You are not superUser ");
  }
}