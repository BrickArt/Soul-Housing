var express = require('express');
var router = express.Router();
var fs = require('fs');
var join = require('path').join;
var pdfMake = require('pdfmake');
var async = require('async');
var config = require ('../config')


var checkAuth = require('../middleware/checkAuth');

//===========================================
//----------Core pdf module data------------
//===========================================
const pdfMakePrinter = require('../node_modules/pdfmake/src/printer');
const fontDescriptors = {
    Roboto: {
        normal: join(__dirname, '..', 'public', '/fonts/Roboto-Regular.ttf'),
        bold: join(__dirname, '..', 'public', '/fonts/Roboto-Medium.ttf'),
        italics: join(__dirname, '..', 'public', '/fonts/Roboto-Italic.ttf'),
        bolditalics: join(__dirname, '..', 'public', '/fonts/Roboto-MediumItalic.ttf')
    }
};

const printer = new pdfMakePrinter(fontDescriptors);
//===========================================


//===========================================
//-----------------DataBase------------------
//===========================================
var House = require('../models/house').House;
var Gist = require('../models/gist').Gist;
var Residence = require('../models/residence').Residence;
var Test = require('../models/test').Test;
var Program = require('../models/program').Program;
var Payment = require('../models/payment').Payment;

//===========================================
//------------------Router-------------------
//===========================================

// ------------------PDF--------------------
router.get('/doc/houses', function(req, res, next){
  console.log(req.client.parser.incoming._startTime)
  var items = {
    houses: []
  };
  House.find().sort({name: 1}).then(function(doc){
    items.houses = doc;
    next(items)
  });
}, function(items, req, res, next){
  Gist.find({status: true}).then(function(doc){
    items.users = doc;
    next(items)
  });
}, function(items, req, res, next){
  var now = new Date();
  now.setHours(now.getUTCHours() + config.get('timeZone'))
  var d = now.getDay();
  var m = now.getMonth();
  var y = now.getFullYear();
  items.time = d + '.' + m + '.' + y;
  res.send(items);
});


// ------------------PDF api by Allen--------------------
router.get('/api/doc/houses', function(req, res, next){
  var items = {
    houses: [],
    users: [],
    date: "",
  };
  House.find().sort({name: 1}).then(function(doc){
    var houses = [];
    for (var i = 0; i < doc.length; i++) {
      var house = {
        _id: doc[i]._id,
        name: doc[i].name,
        address: doc[i].address,
        rooms: doc[i].rooms,
      }
      houses.push(house)
    }
    items.houses = houses;
    next(items)
  });


}, function(items, req, res, next){
  Payment.find().then(function(doc){
    var payments = [];
    for (var i = 0; i < doc.length; i++) {
      var payment = {
        _id: doc[i]._id,
        userID: doc[i].userID,
        sum: doc[i].sum
      };
      payments.push(payment);
    }
    items.payments = payments;
    next(items)
  });



}, function(items, req, res, next){
  Gist.find({status: true}).then(function(doc){
    var users = [];
    for (var i = 0; i < doc.length; i++) {
      var user = {
        _id: doc[i]._id,
        name: doc[i].name,
        lastname: doc[i].lastname,
        program: doc[i].program,
        balance: doc[i].balance
      };
      // for (var n = 0; n < items.payments.length; n++) {
      //   console.log('+');
      //   if (items.payments[n].userID == doc[i]._id){
      //     user.balance += items.payments[n].sum;
      //   }
      //   if (n === items.payments.length - 1) {
      //   }
      // }
      users.push(user);
    }
    items.users = users;
    next(items)
  });


}, function(items, req, res, next){
  var results = [];
  for (var u = 0; u < items.houses.length; u++) {
    var result = {
      name: items.houses[u].name,
      address: items.houses[u].address,
      rooms: [],
    };

    for (var i = 0; i < items.houses[u].rooms.length; i++) {
      var room = {
        num: items.houses[u].rooms[i].num,
        beds: []
      }
      for (var y = 0; y < items.houses[u].rooms[i].beds.length; y++) {
        var bed = {
          num: items.houses[u].rooms[i].beds[y].num,
          status: items.houses[u].rooms[i].beds[y].status,
          user: {}
        }
        for (var z = 0; z < items.users.length; z++) {
          if (items.users[z]._id == items.houses[u].rooms[i].beds[y].userID) {
            bed.user = items.users[z]
          }
          if (z === items.users.length - 1) {
            room.beds.push(bed);
          }
        }
        if (y === items.houses[u].rooms[i].beds.length - 1) {
          result.rooms.push(room);
        }
      }
      if (i === items.houses[u].rooms.length - 1) {
        results.push(result);
      }
    }
    if (u === items.houses.length - 1) {
      next(results)
    }
  }


}, function(results, req, res, next){
  var items = {
    houses: results,
    date: "",
  }
  var now = new Date();
  now.setHours(now.getUTCHours() + config.get('timeZone'))
  var hh = now.getHours();
  var mm = now.getMinutes()
  var d = now.getDate();
  var m = now.getMonth() + 1;
  var y = now.getFullYear();
  if (d < 10) {
    d = '0' + d;
  }
  if(m < 10){
    m = '0' + m;
  }
  var time;
  if (hh > 12) {
    time = ' ' + (hh - 12) + ':' + mm + 'PM';
  } else {
    time = ' ' + hh + ':' + mm + 'AM';
  }

  items.date = m + '.' + d + '.' + y + time;
  next(items);

}, function(items, req, res, next){
    var pdfData = getPages(items);
    const pdfDoc = printer.createPdfKitDocument(pdfData);
    
    var date = new Date();
    var h = date.getUTCHours() + config.get('timeZone');
    var min = date.getMinutes();
    if(h < 10) h = '0' + h;
    if(min < 10) min = '0' + min;
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var y = date.getFullYear().toString().slice(2);
    if(m < 10) m = '0' + m;
    if(d < 10) d = '0' + d;
    // var fileName = 'houses_' + h + '_' + min + '_' + m + '_' + d + '_' + y + '.pdf'
    var fileName = 'houses_' + m + '_' + d + '_' + y + '_' + h + '_' + min + '.pdf'


    res.set({
      "Content-Disposition" : 'attachment; filename=' + fileName + ''});
    pdfDoc.pipe(res);
    pdfDoc.end();
});



router.get('/api/doc/houses/house_:id?', function(req, res, next){
  var id = req.params.id;
  var items = {
    house: [],
    users: [],
    date: "",
  };
  House.findById(id)
  .then(function(doc){

    var house = {
      _id: doc._id,
      name: doc.name,
      address: doc.address,
      rooms: doc.rooms,
    }
    items.house = house;

    next(items);
  });


}, function(items, req, res, next){
  Payment.find().then(function(doc){
    var payments = [];
    for (var i = 0; i < doc.length; i++) {
      var payment = {
        _id: doc[i]._id,
        userID: doc[i].userID,
        sum: doc[i].sum
      };
      payments.push(payment);
    }
    items.payments = payments;
    next(items)
  });


}, function(items, req, res, next){
  Gist.find({status: true}).then(function(doc){
    var users = [];
    for (var i = 0; i < doc.length; i++) {
      var user = {
        _id: doc[i]._id,
        name: doc[i].name,
        lastname: doc[i].lastname,
        program: doc[i].program,
        balance: 0
      };
      for (var n = 0; n < items.payments.length; n++) {
        if (items.payments[n].userID == doc[i]._id){
          user.balance += items.payments[n].sum;
        }
        if (n === items.payments.length - 1) {
          users.push(user);
        }
      }
    }
    items.users = users;
    next(items)
  });



}, function(items, req, res, next){
  var result = {
    name: items.house.name,
    address: items.house.address,
    rooms: [],
  }
  if(items.house.rooms.length === 0) return next(result)
  for (var i = 0; i < items.house.rooms.length; i++) {
    var room = {
      num: items.house.rooms[i].num,
      beds: []
    }
    for (var y = 0; y < items.house.rooms[i].beds.length; y++) {
      var bed = {
        num: items.house.rooms[i].beds[y].num,
        status: items.house.rooms[i].beds[y].status,
        user: {}
      }
      for (var z = 0; z < items.users.length; z++) {
        if (items.users[z]._id == items.house.rooms[i].beds[y].userID) {
          bed.user = items.users[z]
        }
        if (z === items.users.length - 1) {
          room.beds.push(bed);
        }
      }
      if (y === items.house.rooms[i].beds.length - 1) {
        result.rooms.push(room);
      }
    }
    if (i === items.house.rooms.length - 1) {
      next(result)
    }
  }

}, function(result, req, res, next){
  var now = new Date();
  now.setHours(now.getUTCHours() + config.get('timeZone'))
  var hh = now.getHours();
  var mm = now.getMinutes()
  var d = now.getDate();
  var m = now.getMonth() + 1;
  var y = now.getFullYear();
  if (d < 10) {
    d = '0' + d;
  }
  if(m < 10){
    m = '0' + m;
  }

  var time;
  if (hh > 12) {
    time = ' ' + (hh - 12) + ':' + mm + 'PM';
  } else {
    time = ' ' + hh + ':' + mm + 'AM';
  }

  result.date = m + '.' + d + '.' + y + time;
  next(result);

}, function(result, req, res, next){

  var pdfData = getPage(result);
  const pdfDoc = printer.createPdfKitDocument(pdfData);


  var date = new Date();
  var h = date.getUTCHours() + config.get('timeZone');
  var min = date.getMinutes();
  if(h < 10) h = '0' + h;
  if(min < 10) min = '0' + min;
  var m = date.getMonth() + 1;
  var d = date.getDate();
  var y = date.getFullYear().toString().slice(2);
  if(m < 10) m = '0' + m;
  if(d < 10) d = '0' + d;
  // var fileName = result.name + '_' + h + '_' + min + '_' + m + '_' + d + '_' + y + '.pdf'
  var fileName = result.name + ' - ' + m + '_' + d + '_' + y + '_' + h + '_' + min + '.pdf'


  res.set({"Content-Disposition" : 'attachment; filename=' + fileName + ''});
  pdfDoc.pipe(res);
  pdfDoc.end();


});

function getPages(items){
  var doc = {
    header: {
      width: 150,
      image: './public/img/png/pdflogo.png',
      alignment: 'center',
      style: 'header'
    },
    footer: {
      // text: 'Notes:____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
      style: ['footer', 'main'],
      table: {
        widths: ['100%'],
        headerRows: 0,
        body: [['Notes: '], ['    '], ['    '], ['    '], ['    '], ['    '], ['    ']]
      },
      layout: 'lightHorizontalLines'
    },
    content: [],
    styles: {
      title: {
        fontSize: 20
      },
      titleBold: {
        fontSize: 20,
        bold: true,
      },
      main: {
        fontSize: 14
      },
      mainBold: {
        fontSize: 14,
        bold: true,
      },
      second: {
        fontSize: 10
      },
      header: {
        margin: [0,35,0,0]
      },
      footer: {
        margin: [45,-150,45,0]
      },
      first: {
        margin: [0,65,0,0]
      },
      address: {
        margin: [0,0,0,50]
      },
      room: {
        margin: [0,0,20,10]
      },
      up: {
        margin: [0,-10,0,0]
      },
      down: {
        margin: [0,5,0,0]
      },
      line: {
        margin: [0,25,0,35]
      },

    }
  };

  for (var i = 0; i < items.houses.length; i++) {
    var house = {
      style: 'first',
      columns: [
        {
          width:'*',
          text: items.houses[i].name,
          style: 'titleBold'
        },
        {
          width:'*',
          text: items.date,
          alignment: 'right',
          style: 'title'
        }
      ]
    };
    var address = {
      text: items.houses[i].address,
      style: ['main', 'address']
    }

    doc.content.push(house);
    doc.content.push(address);

    for (var e = 0; e < items.houses[i].rooms.length; e++) {
      if (e < 5) {
        var room = {
          columns: [
            {
              text: 'Room: ' + items.houses[i].rooms[e].num,
              style: ['mainBold', 'room', 'down'],
              width: '16%'
            },
            {
              style: ['second', 'room', 'up'],
              width: '42%',
              table: {
                widths: ['100%'],
                headerRows: 0,
                body: [[' '],['']]
              },
              layout: 'lightHorizontalLines'
            },
            {
              style: ['second', 'room', 'up'],
              width: '42%',
              table: {
                widths: ['100%'],
                headerRows: 0,
                body: [[' '],['']]
              },
              layout: 'lightHorizontalLines'
            }
          ]
        }
        for (var y = 0; y < items.houses[i].rooms[e].beds.length; y++) {
          if (items.houses[i].rooms[e].beds[y].status === true) {
            var user = items.houses[i].rooms[e].beds[y].user;
            var bed = {
              text: user.name + ' ' + user.lastname + '      ' + user.program + '      ' + user.balance + ' $'
            }
            if (y%2===0) {
              room.columns[1].table.body[0][0] = bed;
            } else {
              room.columns[2].table.body[0][0] = bed;
            }
            if(items.houses[i].rooms[e].beds.length === 1){
              room.columns.splice(2, 1)
            }
            // расширяем для большего количества кроватей
          }
        }
        doc.content.push(room);
      } else {
        if (e === 5) {
          var line = {
            style: 'line',
            width: '100%',
            table: {
              widths: ['100%'],
              headerRows: 1,
              body: [[' '],[' ']]
            },
            layout: 'lightHorizontalLines'
          };
          doc.content.push(line);
        }
        var room = {
          columns: [
            {
              text: 'Room: ' + (+items.houses[i].rooms[e].num - 5),
              style: ['mainBold', 'room', 'down'],
              width: '16%'
            },
            {
              style: ['second', 'room', 'up'],
              width: '42%',
              table: {
                widths: ['100%'],
                headerRows: 0,
                body: [[' '],['']]
              },
              layout: 'lightHorizontalLines'
            },
            {
              style: ['second', 'room', 'up'],
              width: '42%',
              table: {
                widths: ['100%'],
                headerRows: 0,
                body: [[' '],['']]
              },
              layout: 'lightHorizontalLines'
            }
          ]
        }
        for (var y = 0; y < items.houses[i].rooms[e].beds.length; y++) {
          if (items.houses[i].rooms[e].beds[y].status === true) {
            var user = items.houses[i].rooms[e].beds[y].user;
            var bed = {
              text: user.name + ' ' + user.lastname + '      ' + user.program + '      ' + user.balance + ' $'
            }
            if (y%2===0) {
              room.columns[1].table.body[0][0] = bed;
            } else {
              room.columns[2].table.body[0][0] = bed;
            }
            // расширяем для большего количества кроватей
          }
        }
        doc.content.push(room);
      }
      if (e === (items.houses[i].rooms.length - 1)) {

        var page = {
          text: '',
          pageBreak: 'after'
        }
        if(i < items.houses.length - 1){
          doc.content.push(page);
        }

      }
    }

    if (i === items.houses.length - 1) {
      return doc
    }
  }







};


function getPage(result){
  var doc = {
    header: {
      width: 150,
      image: './public/img/png/pdflogo.png',
      alignment: 'center',
      style: 'header'
    },
    footer: {
      // text: 'Notes:____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
      style: ['footer', 'main'],
      table: {
        widths: ['100%'],
        headerRows: 0,
        body: [['Notes: '], ['    '], ['    '], ['    '], ['    '], ['    '], ['    ']]
      },
      layout: 'lightHorizontalLines'
    },
    content: [
      {
        style: 'first',
        columns: [
          {
            width:'*',
            text: result.name,
            style: 'titleBold'
          },
          {
            width:'*',
            text: result.date,
            alignment: 'right',
            style: 'title'
          }
        ]
      },
      {
        text: result.address,
        style: ['main', 'address']
      },
    ],
    styles: {
      title: {
        fontSize: 20
      },
      titleBold: {
        fontSize: 20,
        bold: true,
      },
      main: {
        fontSize: 14
      },
      mainBold: {
        fontSize: 14,
        bold: true,
      },
      second: {
        fontSize: 10
      },
      header: {
        margin: [0,35,0,0]
      },
      footer: {
        margin: [45,-150,45,0]
      },
      first: {
        margin: [0,65,0,0]
      },
      address: {
        margin: [0,0,0,50]
      },
      room: {
        margin: [0,0,20,10]
      },
      up: {
        margin: [0,-10,0,0]
      },
      down: {
        margin: [0,5,0,0]
      },
      line: {
        margin: [0,25,0,35]
      },

    }
  };

if(result.rooms.length > 0){

  for (var i = 0; i < result.rooms.length; i++) {
    if (i < 5) {
      var room = {
        columns: [
          {
            text: 'Room: ' + result.rooms[i].num,
            style: ['mainBold', 'room', 'down'],
            width: '16%'
          },
          {
            style: ['second', 'room', 'up'],
            width: '42%',
            table: {
              widths: ['100%'],
              headerRows: 0,
              body: [[' '],['']]
            },
            layout: 'lightHorizontalLines'
          },
          {
            style: ['second', 'room', 'up'],
            width: '42%',
            table: {
              widths: ['100%'],
              headerRows: 0,
              body: [[' '],['']]
            },
            layout: 'lightHorizontalLines'
          }
        ]
      }
      for (var y = 0; y < result.rooms[i].beds.length; y++) {
        if (result.rooms[i].beds[y].status === true) {
          var user = result.rooms[i].beds[y].user;
          var bed = {
            text: user.name + ' ' + user.lastname + '      ' + user.program + '      ' + user.balance + ' $'
          }
          if (y%2===0) {
            room.columns[1].table.body[0][0] = bed;
          } else {
            room.columns[2].table.body[0][0] = bed;
          }
          // расширяем для большего количества кроватей

          if(result.rooms[i].beds.length === 1){
            room.columns.splice(2, 1)
          }
        }
      }
      doc.content.push(room);
    } else {
      if (i === 5) {
        var line = {
          style: 'line',
          width: '100%',
          table: {
            widths: ['100%'],
            headerRows: 1,
            body: [[' '],[' ']]
          },
          layout: 'lightHorizontalLines'
        };
        doc.content.push(line);
      }
      var room = {
        columns: [
          {
            text: 'Room: ' + (+result.rooms[i].num - 5),
            style: ['mainBold', 'room', 'down'],
            width: '16%'
          },
          {
            style: ['second', 'room', 'up'],
            width: '42%',
            table: {
              widths: ['100%'],
              headerRows: 0,
              body: [[' '],['']]
            },
            layout: 'lightHorizontalLines'
          },
          {
            style: ['second', 'room', 'up'],
            width: '42%',
            table: {
              widths: ['100%'],
              headerRows: 0,
              body: [[' '],['']]
            },
            layout: 'lightHorizontalLines'
          }
        ]
      }
      for (var y = 0; y < result.rooms[i].beds.length; y++) {
        if (result.rooms[i].beds[y].status === true) {
          var user = result.rooms[i].beds[y].user;
          var bed = {
            text: user.name + ' ' + user.lastname + '      ' + user.program + '      ' + user.balance + ' $'
          }
          if (y%2===0) {
            room.columns[1].table.body[0][0] = bed;
          } else {
            room.columns[2].table.body[0][0] = bed;
          }
          // расширяем для большего количества кроватей
        }
      }
      doc.content.push(room);
    }
    if (i === result.rooms.length - 1) {
      return doc
    }
  }
} else{
  return doc
}

};













module.exports = router;
