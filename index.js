// APP DEPENDENCIES
const express = require('express'),
      app = express(),
      router = express.Router(),
      fs = require("fs"),
      path = require('path'),
      ejs = require('ejs'),
      showdown  = require('showdown'),
      converter = new showdown.Converter(),
      sharp = require('sharp'),
      jsonServer = require('json-server'),
      dirman = require("./scripts/dirman.js");

sharp.concurrency(1);
sharp.cache(50);
//OTHER SCRIPTS
//sets the view engine to EJS and port to 3000
app.set('view engine', 'ejs')
app.set('port', (process.env.PORT || 4000))

// Get content from file
var masterDB = fs.readFileSync("db.json"),
    parsedMasterDB = JSON.parse(masterDB),
    portfolioDB = parsedMasterDB.mihako;

// SORTING PROJECT FROM EARLIEST TO OLDEST
function custom_sort(a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
}
portfolioDB.sort(custom_sort);

//rouing to index page
app.get('', function(request, response) {

  // PORTFOLIO DATABASE AND BIO
  var data = [],
      personalInfo = parsedMasterDB.personalInfo,
  // ARE WE ON PROJECT DETAILS?
      isProjectDetails = false;


  // SIFT THROUGH THE DATA AND DISPLAY ONLY THE VISIBLE ONE
  for (var i = 0; i < portfolioDB.length; i++) {
    if (portfolioDB[i].visible) {
      data[i] = portfolioDB[i];
      }
  }

  // RENDER THE TEMPLATE
  response.render('index', {
    data: data,
    personalInfo: personalInfo,
    isProjectDetails:isProjectDetails
  });
})

//routing to details page
app.get('/projects/:projectID', function(request, response) {

  // PORTFOLIO DATABASE AND BIO
  var data = [];
  var personalInfo = parsedMasterDB.personalInfo;

  //MARKDOWN CONVERSION
  var markdown = fs.readFileSync("./public/md/projects/" + request.params.projectID +".md", "utf8",(err, data) => {
    if (err) {
      console.log(err.stack);
      return;
    }
    console.log(data.toString());
  });
  var parsedHtml = converter.makeHtml(markdown);

  // SIFT THROUGH THE DATA AND DISPLAY ONLY THE VISIBLE ONE
  for (var i = 0; i < portfolioDB.length; i++) {
    if (portfolioDB[i].visible) {
      data[i] = portfolioDB[i];
      }
  }

  // FETCH THE SPECIFIC PROJECT
  var project;
  for (var i = 0; i < portfolioDB.length; i++) {
    if(portfolioDB[i].directory == request.params.projectID){
      project = portfolioDB[i];
      // console.log(project);
    }
  }

  // ARE WE ON PROJECT DETAILS
  var isProjectDetails = true;

  // RENDER THE TEMPLATE AND PAGE
  response.render('details', {
    projectID: request.params.projectID,
    project: project,
    personalInfo: personalInfo,
    data:data,
    parsedHtml: parsedHtml,
    isProjectDetails: isProjectDetails
  });
})

//routing to dev_log page
app.get('/dev_log', function(request, response) {

  //MARKDOWN CONVERSION
  var markdown = fs.readFileSync("./public/md/devlog/devlog.md", "utf8",(err, data) => {
    if (err) {
      console.log(err.stack);
      return;
    }
    console.log(data.toString());
  });
  var parsedDevLog = converter.makeHtml(markdown);

  // RENDER THE TEMPLATE AND PAGE
  response.render('devlog', {
    parsedDevLog: parsedDevLog
  });
})

//routing to lumograph api
app.get('/lumograph/api', function(request, response) {

  // FETCH ALL THE COLLECTION WITH THEIR FRAMES
  var photoIndexPath = "lumographDB.json", // to store all photoIndexDB
      collectionList = [], //list of all collections
      collectionsDirectory = "./public/collections/";

  dirman.walkSyncCollection(collectionsDirectory,collectionList); //detect all directories
  dirman.insertFrameSpecs(photoIndexPath,collectionList) //match the frame and their spec from the DB
  // console.log(collectionList); //debug


  // RENDER THE TEMPLATE AND PAGE
  response.json({
    collectionList: collectionList
  })
});

//routing to lumograph page
app.get('/lumograph', function(request, response) {

  // FETCH ALL THE COLLECTION WITH THEIR FRAMES
  var photoIndexPath = "lumographDB.json", // to store all photoIndexDB
      collectionList = [], //list of all collections
      collectionsDirectory = "./public/collections/";

  dirman.walkSyncCollection(collectionsDirectory,collectionList); //detect all directories
  dirman.insertFrameSpecs(photoIndexPath,collectionList) //match the frame and their spec from the DB
  // console.log(collectionList); //debug


  // collection statistics TO BE DETERMINED AND DEVELOPED
  var collectionStats = [],
      totalFrames = 0;
  for (var i = 0; i < collectionList.length; i++) {
    totalFrames += collectionList[i].frames.length
  }

  var statsObj = {
        totalCollections: collectionList.length,
        totalFrames: totalFrames,
        user: null
      };
  collectionStats.push(statsObj);
  // console.log(collectionStats[0].totalCollections);

  // RENDER THE TEMPLATE AND PAGE
  response.render('lumograph', {
    parsedCollectionList: JSON.stringify(collectionList),
    collectionStats: collectionStats,
    collectionList: collectionList
  });
})

//routing to lumograph details page
app.get('/lumograph/collections/:collectionID', function(request, response) {

  // FETCH ALL THE COLLECTION WITH THEIR FRAMES
  var photoIndexPath = "lumographDB.json", // to store all photoIndexDB
      collectionList = [], //list of all collections
      collectionsDirectory = "./public/collections/";

  dirman.walkSyncCollection(collectionsDirectory,collectionList); //detect all directories
  dirman.insertFrameSpecs(photoIndexPath,collectionList) //match the frame and their spec from the DB
  // console.log(collectionList); //debug

  // FETCH THE SPECIFIC COLLECTION
  var collection,
      biggerThanThresh = false,
      threshold = 10;

  for (var i = 0; i < collectionList.length; i++) {
    if(collectionList[i].name == request.params.collectionID){
      collection = collectionList[i];
      // console.log(collection);
    }
  }

  if (collection.frames.length > threshold) {
      biggerThanThresh = true;
  }

  // RENDER THE TEMPLATE AND PAGE
  response.render('lumographDetails', {
    biggerThanThresh: biggerThanThresh,
    collection: collection,
    collectionList: collectionList
  });
})

//routing to lumograph details page
app.get('/lumograph/master', function(request, response) {

  // FETCH ALL THE COLLECTION WITH THEIR FRAMES
  var photoIndexPath = "lumographDB.json", // to store all photoIndexDB
      jsonFile = fs.readFileSync(photoIndexPath), //read the database
      masterLedger = JSON.parse(jsonFile), //Parse the data from JSON file
      masterList = masterLedger.masterIndex;

      // SORTING PROJECT FROM EARLIEST TO OLDEST
      function photo_sort(a, b) {
          return new Date(b.id).getTime() - new Date(a.id).getTime();
      }
      masterList.sort(photo_sort);

  // RENDER THE TEMPLATE AND PAGE
  response.render('lumographMaster', {
    masterList: masterList
  });
})

//directories that the app uses
app.use('/DB0001', jsonServer.router('db.json'))
app.use(express.static(__dirname + '/public'))

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
