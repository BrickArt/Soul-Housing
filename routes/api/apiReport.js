var express = require('express');
var router = express.Router();
var async = require('async');
const fs = require('fs');

var checkAuth = require('../../middleware/checkAuth');



//===========================================
//-----------------DataBase------------------
//===========================================
var House = require('../../models/house').House;
var Gist = require('../../models/gist').Gist;
var Residence = require('../../models/residence').Residence;
var Test = require('../../models/test').Test;
var Payment = require('../../models/payment').Payment;
var Program = require('../../models/program').Program;

const exel = require('../../lib/exelCreate');



//===========================================
//------------------Router-------------------
//===========================================

//------------------GET--------------------
router.get('/report/data', function(req, res, next){
    var items = {
      freeBeds: 0,
      houses: 0,
      users: 0,
      money: 0
    };
  
    House.find().then(function(doc){
      for (var i = 0; i < doc.length; i++) {
        for (var x = 0; x < doc[i].rooms.length; x++) {
          for (var y = 0; y < doc[i].rooms[x].beds.length; y++) {
            if (doc[i].rooms[x].beds[y].status === false) {
              ++items.freeBeds;
            }
            doc[i].rooms[x].beds[y].status
          }
        }
        if (i === doc.length - 1) {
          items.houses = doc.length
          next(items);
        }
      }
    });
  }, function(items, req, res, next){
    Payment.find().then(function(doc){
      console.log(doc)
      for (var n = 0; n < doc.length; n++) {
        items.money += +doc[n].sum;
        if (n === doc.length - 1) {
          next(items);
        }
      }
    })
  }, function(items, req, res, next){
    Gist.find().then(function(doc){
      items.users = doc.length;
      next(items);
    })
  
  }, function(items, req, res, next){
    console.log(items)
    res.send(items)
  });





//------------------Users By program--------------------
router.post('/report/users', async (req, res, next) => {
    const current = await Gist.aggregate([
            {
                $group: {
                    _id: { program: "$program"},
                    count: {$sum: 1}
                }
            }
        ]
    );

    if (!current || current.error) return res.status(500).send(current);
    let result = [];
    current.forEach(el => {
        result.push({
            program: el._id.program,
            count: el.count
        })
    });

    return res.send(result);


});

//------------------Payments By program--------------------
router.post('/report/payments', async (req, res, next) => {
  if (!req || !req.body) return res.status(500).json('no data');
    const start = new Date(req.body.start);
    const end = new Date(req.body.end);
    const program = req.body.program;

    const current = await Payment.aggregate([
            {
                $match: {
                    program: program,
                    date: {
                        $gt: start,
                        $lt: end
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: {$month: "$date"},
                        day: {$dayOfMonth: "$date"},
                        year: {$year: "$date"}
                    },
                    //_id: {date: "$date"},
                    totalSum: {$sum: "$sum"},
                    count: {$sum: 1}
                }
            },
            { $sort:
                { "_id": 1 }
            }
        ]
    );

    if (!current || current.error) return res.status(500).send(current);
    return res.send(current);
});



//------------------Exel create--------------------

router.get('/report/createReport', async (req, res, next) => {
    const gistInfo = await Gist.find()
        .catch(e => {
            return e
        });

    if (!gistInfo || gistInfo.error) return res.status(500).json(gistInfo);

    let response = [];

    const findActualResidence = async residences => {
        for (let i in residences) {
            if (residences[i].endDate === null) {
                return residences[i];
            }
        }
    };

    await gistInfo.forEachAsync(async el => {
        const residencesByUser = await Residence.find({userID: el._id.toString()})
            .catch(e => {
                return e
            });
        let addres, room, price, date;

        const residenceInfo = await findActualResidence(residencesByUser);
        const emptyValue = "empty";

        if (el.residence && residenceInfo) {
            const houseInfo = await House.find({_id: residenceInfo.houseID })
                .catch(e => {
                    console.log(e);
                    return e
                });
            if (!houseInfo[0] || !houseInfo[0].address) {
                addres = emptyValue;
            } else {
                addres = houseInfo[0].address;
            }
            var d = residenceInfo.startDate.getDate();
            var m = residenceInfo.startDate.getMonth() + 1;
            var y = residenceInfo.startDate.getFullYear();
            if(d<10){
              d = '0' + d;
            }
            if(m<10){
              m = '0' + m;
            }

            date = m + '.' + d + '.' + y;
            room = residenceInfo.room.toString();
            price = residenceInfo.price.toString();
        } else {
            addres = emptyValue;
            room = emptyValue;
            price = "0";
        }




        let answer = {
            NUMBER: "",
            NAME: el.name,
            LASTNAME: el.lastname,
            LOCATION: addres,
            ROOM: room,
            PAYMENT_SOURCE: el.program,
            AMOUNT: price,
            MOVE_IN: date
        };
        response.push(answer);
        //if (!residenceInfo || residenceInfo.error) return res.status(500).json(residenceInfo);

    });
    //console.log(response);

    const sortFunction = (a, b) => {
        if (a.AMOUNT > b.AMOUNT) return 1;
        if (a.AMOUNT < b.AMOUNT) return -1;
    };

    const query = response.sort(sortFunction).reverse();
    const numericQuery = query.map((el, number) => {
        el.NUMBER = (number + 1).toString();
        return el;
    });

    const file = await exel.create(numericQuery)
        .catch(e => {
            console.log(e);
            return e;
        });
    //file.write('ExcelFile.xlsx');

    //fs.createReadStream('ExcelFile.xlsx').pipe(res);
    //res.download('ExcelFile.xlsx');
    // census_mm:hh_mm_dd_yyyy
    var date = new Date;
    var h = date.getHours();
    var min = date.getMinutes();
    if(h < 10) h = '0' + h;
    if(min < 10) min = '0' + min;
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var y = date.getFullYear();
    if(m < 10) m = '0' + m;
    if(d < 10) d = '0' + d;
    var fileName = 'census_' + min + '_' + h + '_' + m + '_' + d + '_' + y + '.xlsx'
    file.write(fileName, res);
});










module.exports = router;
