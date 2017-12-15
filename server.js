var GITHUB_CLIENT_ID="7471015368ecdc5fd104";
var GITHUB_CLIENT_SECRET="c97a73345fa900cd41eaa2a355d37026ff34e9fb";



var express = require("express"),
	passport = require("passport"),
	request = require("request"),
	cookieParser= require("cookie-parser"),
	GitHubStrategy = require("passport-github").Strategy;
	
var port = 3000;
var app= express();
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());


passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
        cb(null,{accessToken:accessToken,
				refreshToken:refreshToken,
				profile:profile});
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});
app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    var token=req.user.accessToken;
	res.cookie("token",token,{maxAge:90000000});
    res.redirect('/');
  });
app.get("/userinfo", function(req,res){
	
	var token=req.query.token;
	request({url :'https://api.github.com/user?access_token='+token,
			 headers : {"User-Agent" : "request"}}, function (error, response, body) {
		res.send(body);
});
});

app.get("/", function(req,res){
	var token=req.cookies["token"];
	console.log(token);
	if(!token){
		res.redirect("/login.html");
	}
	res.redirect("/home.html");
});
app.get("/do", function(req,res){
	res.send("this is doing something.");
});
app.use(express.static('public'));
var server = app.listen(port, function(){
	console.log("listening on port d%", server.address().port);
});
	
	