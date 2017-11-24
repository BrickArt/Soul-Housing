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
    schedule       = require('node-schedule'),
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

var unpaid = require('./routes/unpaid');
var pending = require('./routes/pending');

//----------------DataBase-------------------
var mongoose = require('./lib/mongoose');

var MongoStore = require('connect-mongo')(session);

app.use(logger('dev'));

var Residence = require('./models/residence').Residence;
var Payment = require('./models/payment').Payment;
var Unpaid = require('./models/unpaid').Unpaid;



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

// ======      Sheduler      ======

// schedule.scheduleJob('*/10 * * * * *', function(){
//   console.log('The answer to life, the universe, and everything!');
//   var items = {};
//   items.time = new Date();
 

//   Residence.find({endDate: null}).then(function(doc){
//       if(doc.length > 0){
//           items.residence = doc;

//           //--each residences 
//           var sum = 0;
//           for (let i = 0; i < items.residence.length; i++) {
//               const element = items.residence[i];
//               var pay = new Payment({
//                   date: new Date(),
//                   sum: element.price,
//                   type: null,
//                   program: null,
//                   status: 'system',
//                   userID: element.userID
//               });
//               pay.save(function (err) {
//                   if (err) {
//                     console.log(err);
//                     return;
//                   }
//                 });
//               sum += element.price;
//               //--stop eaching
//               if(i === items.residence.length - 1){
//                   var s = new Date();
//                   var n = s - items.time
      
//                   var log = new Unpaid({
//                       date: new Date(),
//                       count: i,
//                       sum: sum,
//                       timeout: n/1000 + ' ms',
//                   })
//                   log.save(function (err) {
//                       if (err) {
//                         console.log(err);
//                         return;
//                       }
//                     });
      
//                   console.log(n/1000 + ' ms')
//                   return;
//               }
      
              
//           }
          
//       } else {
//           return;
//       }
//   })
// });

var unpa = function(){
  console.log('The answer to life, the universe, and everything!');
  var items = {};
  items.time = new Date();
 

  Residence.find({endDate: null}).then(function(doc){
      if(doc.length > 0){
          items.residence = doc;

          //--each residences 
          var sum = 0;
          for (let i = 0; i < items.residence.length; i++) {
              const element = items.residence[i];
              var pay = new Payment({
                  date: new Date(),
                  sum: element.price,
                  type: null,
                  program: null,
                  status: 'system',
                  userID: element.userID
              });
              pay.save(function (err) {
                  if (err) {
                    console.log(err);
                    return;
                  }
                });
              sum += element.price;
              //--stop eaching
              if(i === items.residence.length - 1){
                  var s = new Date();
                  var n = s - items.time
      
                  var log = new Unpaid({
                      date: new Date(),
                      count: i,
                      sum: sum,
                      timeout: n/1000 + ' ms',
                  })
                  log.save(function (err) {
                      if (err) {
                        console.log(err);
                        return;
                      }
                    });
      
                  console.log(n/1000 + ' ms')
                  return;
              }
      
              
          }
          
      } else {
          return;
      }
  })
}




function init() {
  var m = new Date();
  Unpaid.find().then(function(doc){
    for (let i = 0; i < doc.length; i++) {
      const el = doc[i];
      if(m.getMonth() === el.date.getMonth()){
        console.log('init')
        
        console.log(el)


        return;
      }
      if(i === doc.length - 1){
        return unpa();
      }
    }
  })
};
init();

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

app.use('/', unpaid);
app.use('/', pending);


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
