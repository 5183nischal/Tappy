// LAZY LOADER SCRIPT SO WE DONT HAVE TO LOAD ALL THE IMAGES AT ONCE,
// BUT DYNAMICALLY AS THE USER SCOLLS

let collections = [], //to store the collections from the api
    collectionDiv = document.getElementById('content'),
    remainder, //how many collections remain to be loaded
    framesRemainder, //how many frames remain to be loaded
    frameThreshold = 10, //how many frames should be loaded on each collection
    currentAmount, //amount of collections
    currentIndex, //keep track of which collection we are at
    initDisplayAmount = 6, //how many collections to load once u hit bottom
    stopLoading = false,
    finished = false; //check to see if uve loaded them all


//GET DATA THROUGH API
$.getJSON( "lumograph/api", function( data ) {

  currentAmount = data.collectionList.length; //set the current amount to nbr of collections
  //push all the data in collections
  for (var i = 0; i < data.collectionList.length; i++) {
    collections.push(data.collectionList[i]);
    // console.log(collections[i].name);
  }

  //CHECK TO SEE THAT THERE IS AT LEAST A MINIMUM AMOUNT OF COLLECTIONS
  if(currentAmount > initDisplayAmount){
    //push all the data in the array
    for (var i = 0; i < initDisplayAmount; i++) {
      currentIndex = i + 1;//update the current index
      // console.log(currentIndex);
      //html format template of the collection
      let htmlElement =
      "<div class='collection' data-aos='fade-up'>"+
      "<a href='/lumograph/collections/" + collections[i].name + "'><h1>"+ collections[i].name +"</h1></a>" +
      "<div class='spacer'></div>"
      ;

      //ONLY PUT A MAXIMUM OF 10 FRAMES INSIDE
      if (collections[i].frames.length <= frameThreshold){
        framesRemainder = collections[i].frames.length;
      } else {
        framesRemainder = frameThreshold;
      }
      //PUT ALL THE FRAMES
      for (var j = 0; j < framesRemainder; j++) {
        htmlElement +=
        "<a href='/lumograph/collections/" + collections[i].name +"'>" +
        "<img src='/collections/" + collections[i].name + "/" + collections[i].frames[j].index + ".jpg' alt=''>" +
        "</a>"
        ;
      }
      htmlElement += "</div>";

      collectionDiv.innerHTML += htmlElement; //append to html
    }
  } else {
    for (var i = 0; i < collections.length; i++) {

      //html format template of the collection
      let htmlElement =
      "<div class='collection' data-aos='fade-up'>"+
      "<a href='/lumograph/collections/" + collections[i].name + "'><h1>"+ collections[i].name +"</h1></a>" +
      "<div class='spacer'></div>"
      ;
      //ONLY PUT A MAXIMUM OF 10 FRAMES INSIDE
      if (collections[i].frames.length <= frameThreshold){
        framesRemainder = collections[i].frames.length;
      } else {
        framesRemainder = frameThreshold;
      }
      //PUT ALL THE FRAMES
      for (var j = 0; j < framesRemainder; j++) {
        htmlElement +=
        "<a href='/lumograph/collections/" + collections[i].name +"'>" +
        "<img src='/collections/" + collections[i].name + "/" + collections[i].frames[j].index + ".jpg' alt=''>" +
        "</a>"
        ;
      }
      htmlElement += "</div>";

      collectionDiv.innerHTML += htmlElement; //append to html
    }
  }


});

//CHECKS TO SEE IF I SCROLLED TO THE BOTTOM
$(window).scroll(function() {
  if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
      if (!finished) {
        addCollections(currentIndex);
        // console.log("bottom!");
      }
  }
});

// ADD MORE COLLECTIONS TO THE CONTENT
function addCollections(lastIndex){
  // CHECK TO SEE HOW MANY COLLECTIONS ARE LEFT TO DETERMINE HOW MANY WE CAN ADD
  if ((collections.length - lastIndex) > initDisplayAmount){
    remainder = lastIndex + initDisplayAmount;
  } else {
    remainder = collections.length;
    stopLoading = true;
  }

  for (var i = lastIndex; i < remainder; i++) {
    currentIndex = i + 1;//update the current index
    // console.log(currentIndex);
    //html format template of the collection
    let htmlElement =
    "<div class='collection' data-aos='fade-up'>"+
    "<a href='/lumograph/collections/" + collections[i].name + "'><h1>"+ collections[i].name +"</h1></a>" +
    "<div class='spacer'></div>"
    ;

    //ONLY PUT A MAXIMUM OF 10 FRAMES INSIDE
    if (collections[i].frames.length <= frameThreshold){
      framesRemainder = collections[i].frames.length;
    } else {
      framesRemainder = frameThreshold;
    }
    //PUT ALL THE FRAMES
    for (var j = 0; j < framesRemainder; j++) {
      htmlElement +=
      "<a href='/lumograph/collections/" + collections[i].name +"'>" +
      "<img src='/collections/" + collections[i].name + "/" + collections[i].frames[j].index + ".jpg' alt=''>" +
      "</a>"
      ;
    }
    htmlElement += "</div>";

    collectionDiv.innerHTML += htmlElement; //append to html
  }

  //ADD THE WHITESPACE WHEN THERE IS NO MORE TO LOAD
  if (stopLoading) {
    let htmlWhiteSpace = "<div class='bottom-whitespace'></div>"; // add some whitespace
    collectionDiv.innerHTML += htmlWhiteSpace; //append to end of html
    finished = true;
  }

}

// PSEUDO code
// 1. get the json from api
// 2. make lazy loading counter (e.g increments of 5)
// 3. On scroll down, if remaind > increment (5) load another 5, else load remainder

//ON SCROLL DOWN
// window.addEventListener('scroll', function(e) {
//   console.log("im scrolling down!");
// });

// PREVIOUS EJS CODE IN CONTENT
// <% for(var i = 0; i < collectionList.length; i ++) { %>
//   <div class="collection" data-aos="fade-up">
//     <a href="/lumograph/collections/<%= collectionList[i].name %>"><h1><%= collectionList[i].name %></h1></a>
//     <div class="spacer"></div>
//
//   <!-- LIMIT THE AMOUNT OF IMAGES FOR PERFORMANCE   -->
//   <% if(collectionList[i].frames.length < 10) { %>
//     <% for(var j = 0; j < collectionList[i].frames.length; j++) { %>
//       <a href="/lumograph/collections/<%= collectionList[i].name %>">
//         <img src="/collections/<%= collectionList[i].name %>/<%= collectionList[i].frames[j].index %>.jpg" alt="">
//       </a>
//     <% } %>
//   <% } else { %>
//     <% for(var j = 0; j < 10; j++) { %>
//       <a href="/lumograph/collections/<%= collectionList[i].name %>">
//         <img src="/collections/<%= collectionList[i].name %>/<%= collectionList[i].frames[j].index %>.jpg" alt="">
//       </a>
//     <% } %>
//   <% } %>
//
//   </div>
// <% } %>
// <div class="bottom-whitespace"></div>
