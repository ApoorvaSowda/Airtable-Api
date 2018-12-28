var express = require('express');
var router = express.Router();

var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keydzbbWbUgYRBuxh'}).base('appXInk3gCp6Aq3JT');
router.get('/', function(req, res, next) {
 console.log("started")
 var resultArray = [];
 base('Applicants').select({
   // maxRecords: 5,
   view: "All Applicants"
 }).eachPage(function page(records, fetchNextPage) {
   records.forEach(function(record) {
       // console.log('Retrieved', record.fields);
       // console.log(record.id);
       var id=record.id;
       var recordvalues=record.fields;
       // console.log(recordvalues);
       recordvalues["id"]=id;
       // console.log(recordvalues);
       resultArray.push(recordvalues);
   });
   fetchNextPage();
  },function () {
    console.log("resultArray"+resultArray)
    res.render('index', { items: resultArray });
  },function done(err) {
    if (err) { console.error(err); return; }
 });
});
router.get('/insert', function (req, res, next) {
    res.render("insert");
});
router.post('/insert', function (req, res, next) {
  var item = {
    Name: req.body.name,
    Address: req.body.address,
    Gender: req.body.gender
  };
  base('Applicants').create(item, function(err, record) {
      if (err) { console.error(err); return; }

      console.log("inserted successfully");
  });
  res.redirect('/');
});

router.get('/update/:id', function (req, res, next) {
  var id=req.params.id;
  res.render("update",{"id":id});
});
router.post('/update', function (req, res, next) {
  var item = {
    Name: req.body.name,
    Address: req.body.address,
    Gender: req.body.gender
  };
  var id = req.body.id;
  base('Applicants').update(id,item, function(err, record) {
    if (err) { console.error(err); return; }
    console.log(record.get('Address'));
});
res.redirect('/');
});

router.get('/delete/:id', function (req, res, next) {
  var id= req.params.id;
  res.render("delete",{"id":id});
});

router.post('/delete', function (req, res, next) {
  var id = req.body.id;
  base('Applicants').destroy(id, function(err, deletedRecord) {
    if (err) { console.error(err); return; }
    console.log('Deleted record', deletedRecord.id);
});
  res.redirect('/');
});
module.exports = router;
