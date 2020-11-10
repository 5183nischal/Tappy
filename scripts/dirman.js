var fs = require("fs");
const path = require('path');
const sharp = require('sharp')
sharp.concurrency(1);
sharp.cache(50);

//SET TRUE IF YOU WANT TO RUN IT
var runDirman = false;

var indexCounter = 0 // for the names and keeping tabs of the index
var walkSync = function(dir, filelist) {
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(dir + file + '/', filelist); //continue recursion
    }
    else {
      var src = dir + file; //source of input file
      var slicedExt = file.slice(0, -4); //remove extension
      var dst = __dirname + "/public/collections/"+ indexCounter + ".jpg"; //source of destination
      var pathName = path.basename(dir); //directory name
      var rollIndex = pathName.slice(0,2);
      var roll = pathName.slice(3,-4); //gets the name of the roll from directory
      var isometric = pathName.slice(-3); //gets the iso value of the roll

          //manipulate the image
          sharp(src)
          .resize(src.width,src.height)
          .toBuffer()
          .then( data => {
            fs.writeFileSync(dst, data); //writes it in the destination path
          })
          .catch( err => {
            console.log(err);
          });

      filelist.push({id: indexCounter , name: indexCounter + ".jpg", film: roll, rollNumber: rollIndex, iso: isometric});
      indexCounter ++;
    }
  });
  return filelist;
};

if(runDirman){
  var folderList = [];
  var archiveObj = {
    masterIndex: folderList
  };
  //run the walk
  walkSync("./public/archive/",folderList)
  //INSERT IT INTO THE JSON FILE
  fs.readFile("lumographDB.json", "utf8", function (err, data) {

      var jsonFileArr;
      jsonFileArr = JSON.parse(data); //Parse the data from JSON file
      jsonFileArr.push(archiveObj);
      var newData = JSON.stringify(jsonFileArr);

      fs.writeFile('lumographDB.json', newData, function (err) {
        console.log(err);
      });
  })
}

// console.log("I am dirman!");

module.exports = {
  walkSyncCollection: function(dir, filelist) {
    files = fs.readdirSync(dir);
    filelist = filelist || [];

    //FOR EVERY COLLECTION
    for (var i = 0; i < files.length; i++) {
      var collectionName = path.basename(dir + files[i]); //collection name
      // console.log("This is collection: "+collectionName);

      //structure of one collection
      var collection = {
        name: collectionName,
        frames: []
      };

      photos = fs.readdirSync(dir + files[i])//read the photo in dir

      // FOR EVERY FRAME IN COLLECTION
      for (var j = 0; j < photos.length; j++) {
        var frameName = path.basename(photos[j]); //collection name
        var frameId = frameName.slice(0,-4); //remove jpg ext

        //structure of one frame
        var frame = {
          index: frameId,
          film: null,
          roll: null,
          iso: null
        };

        collection.frames.push(frame);
        // console.log("This is frame: "+ frame);
      }

      filelist.push(collection); //insert it into the colleciton array
    }
    // console.log(filelist);
    return filelist;
  },
  insertFrameSpecs: function(path,collections){

    //read the database
    var jsonFile = fs.readFileSync(path);
    var masterLedger = JSON.parse(jsonFile); //Parse the data from JSON file

    // FOR EVERY COLLECTION
    for (var i = 0; i < collections.length; i++) {
      var frames = collections[i].frames; //fetch the frame of the collection

      // FOR EVERY FRAME IN THAT COLLECTION
      for (var j = 0; j < frames.length; j++) {
        var frameIndex = Number(frames[j].index);
        frames[j].film = masterLedger.masterIndex[frameIndex].film;
        frames[j].roll = masterLedger.masterIndex[frameIndex].rollNumber;
        frames[j].iso = masterLedger.masterIndex[frameIndex].iso;
      }
    }
    return collections;
  }
};
