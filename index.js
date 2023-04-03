const express=require('express');
const path=require('path');
const port = 8000;
const db=require('./config/mongoose');
const app=express();
const cookieParser=require('cookie-parser');
const expressLayouts=require('express-ejs-layouts');
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
//const MongoStore=require('connect-mongo');
const flash=require('connect-flash');
const customMWare=require('./config/middleware');
const passportGoogle=require('./config/passport-google-oauth2-strategy');
const axios = require('axios')
// This is the client ID and client secret that you obtained
// while registering on github app
const clientID = '7b8b2af8b27800254e7f'
const clientSecret = '0eff417e78e731d2079c52c1109e4e9d97f28afb'

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded());
app.use(express.static('assets'));
app.use(cookieParser());
app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(session({
    name:'Codeial',
    secret:'blahSomething',
    saveUninitialized:false,
    resave:false,
    cookie:{maxAge:(1000*60*100)}
    // store: MongoStore.create({ mongoConnection: db,autoRemove:'disabled' },function(err){
    //     console.log(err);
    // })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMWare.setFlash);

// use express router
app.use('/', require('./routes'));

app.get('/github/callback', (req, res) => {

    // The req.query object has the query params that were sent to this route.
    const requestToken = req.query.code
    
    axios({
      method: 'post',
      url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
      // Set the content type header, so that we get the response in JSON
      headers: {
           accept: 'application/json'
      }
    }).then((response) => {
      access_token = response.data.access_token
      res.redirect('/success');
    })
  })
  
  app.get('/success', function(req, res) {
  
    axios({
      method: 'get',
      url: `https://api.github.com/user`,
      headers: {
        Authorization: 'token ' + access_token
      }
    }).then((response) => {
      res.render('pages/success',{ userData: response.data });
    })
  });

app.listen(port,function(err){
    if(err){
        console.log('Error in running the server',err);
    }
    console.log('Yup! My Express server is running on port:',port);
});