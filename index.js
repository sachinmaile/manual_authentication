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

app.listen(port,function(err){
    if(err){
        console.log('Error in running the server',err);
    }
    console.log('Yup! My Express server is running on port:',port);
});