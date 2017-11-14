//===========================================
//-----------------Modules
//===========================================
var join           = require ('path').join,
    HttpError      = require ('./error').HttpError,
    sassMiddleware = require('node-sass-middleware'),
    config         = require ('./config'),
    http           = require ('http'),
    logger         = require ('morgan'),
    fs             = require ('fs'),
    bodyParser     = require ('body-parser'),
    cookieParser   = require ('cookie-parser'),
    session        = require ('express-session'),
    express        = require ('express'),
    app            = express ();

//------------------Routes-------------------
var index = require('./routes/index');
var api = require('./routes/api');
var test = require('./routes/test');
var house = require('./routes/house');
var user = require('./routes/user');
var payment = require('./routes/payment');
var report = require('./routes/report');
var docs = require('./routes/docs');
var apiHouse = require('./routes/api/apiHouse');
var apiUser = require('./routes/api/apiUser');
var apiPayment = require('./routes/api/apiPayment');
var apiResidence = require('./routes/api/apiResidence');
var apiProgram = require('./routes/api/apiProgram');
var apiReport = require('./routes/api/apiReport');

//----------------DataBase-------------------
var mongoose = require('./lib/mongoose');

var MongoStore = require('connect-mongo')(session);

app.use(logger('dev'));



//===========================================
//------------------Config-------------------
//===========================================
app.disable('x-powered-by');

app.set('view engine', 'jade');
app.set('views', join(__dirname, 'views'));

app.use(cookieParser());



//------------------Session-------------------
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: config.get('session:secret'),
                  cookie: {
                    path: "/",
                    maxAge: config.get('session:maxAge'), // 4h max inactivity for session
                    httpOnly: true // hide from attackers
                  },
                  key: "sid",
                  store: new MongoStore({url: config.get('mongoose:uri'),
                                         collection: 'session'})}));


//-------------------Body--------------------
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({extended: true}));

//-------------------Sass--------------------
app.use(sassMiddleware({
  src: join(__dirname, 'public'),
  dest: join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));



//===========================================
//---------------Middlewears-----------------
//===========================================
Array.prototype.forEachAsync = async function(cb) {
    for(let x of this){
        await cb(x);
    }
};



//===========================================
// Router
//===========================================
app.use('/', house);
app.use('/', user);
app.use('/', payment);
app.use('/', report);
app.use('/', docs);
app.use('/', index);
app.use('/api', apiHouse);
app.use('/api', apiUser);
app.use('/api', apiPayment);
app.use('/api', apiResidence);
app.use('/api', apiProgram);
app.use('/api', apiReport);
app.use('/api', api);
// app.use('/test', test);

//------------------Static-------------------
app.use(express.static(join(__dirname, 'public')));



//===========================================
//------------------Server-------------------
//===========================================
var server = app.server = http.createServer(app);
// server.listen(config.get('port'), function() {
//   logger("Express server listening on port " + config.get('port'));
// });

server.listen(process.env.PORT || config.get('port'), function (){
  console.log('App listening on port - ' + config.get('port') + '!')
});
