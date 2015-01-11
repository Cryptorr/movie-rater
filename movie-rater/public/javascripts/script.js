// Init
var totalWidth = 0;
var maxScrollPosition = 0;

function serverRequest(endpoint, method, json, success){
  $.ajax({
    type: method,
    url: endpoint,
    data: json,
    dataType: 'JSON',
    success: function(data){
      success(data);
    },
    error: function() {
      console.log('Could not reach server.');
    }
  });
}

function refreshHome(data){
  //Delete Old Images
  $("#movie-results").empty();
  totalWidth = 0;
  //Fill with Images
  $.each(data.results, function(i,results){
    if(results.poster_path){
      $("<img/>").attr("src", 'http://image.tmdb.org/t/p/' + 'w92' + results.poster_path).attr("class", "gallery__img").attr("alt", "")
      .one('load',function() {
      }).appendTo(
        $("<a/>").attr("class", "gallery__link").attr("href", '/movie/' + results.id)
        .appendTo(
          $("<div/>").attr("class", "gallery__item")
          .appendTo("#movie-results")));
          $("<div/>").attr("class", "gallery__item__title")
            .append(results.title)
            .append("<br><br><br><br><br><br>")
            .appendTo("#movie-results");
      }
    if ( i == 49 ) return false;
  });
  //Find first image
  $(".gallery__item:first").addClass("gallery__item--active");
  $(".gallery").css({ "left": "0"});
};

function toGalleryItem(targetItem){
    if(targetItem.length){
        var newPosition = targetItem.position().left;
        if(newPosition <= maxScrollPosition){
            targetItem.addClass("gallery__item--active");
            targetItem.siblings().removeClass("gallery__item--active");
            $(".gallery").animate({
                left : - newPosition
            });
        } else {
            $(".gallery").animate({
                left : - maxScrollPosition
            });
        };
    };
};

//check if username is valid and passwords are valid/equal
function checkPass(form) {
  if(form.username.value == "") {
    alert("Username cannot be blank!");
    form.username.focus();
    return false;
  }
  re = /^\w+$/;
  if(!re.test(form.username.value)) {
    alert("Username may only contain letters, numbers and underscores!");
    form.username.focus();
    return false;
  }
  if(form.pwd1.value == "" || form.pwd2.value == "") {
    alert("Please fill in both password fields");
    form.pwd1.focus();
    return false;
  }
  if(form.pwd1.value != form.pwd2.value) {
    alert("Error: Passwords were not equal, so no account could be created");
    form.pwd1.focus();
    return false;
  }
  if(!re.test(form.pwd1.value)) {
    alert("Password may only contain letters, numbers and underscores!");
    form.pwd1.focus();
    return false;
  }
};

$(window).load(function(){
   //Check url hash
  if(document.location.hash.length > 0){
    //If url contains an hash string
    $('#imagesearch').val(unescape(document.location.hash.substring(1)));
    //Request images from api
    var data = {query : unescape(document.location.hash.substring(1))};
    serverRequest('/browse', 'POST', data, function(d){
      //Load new images
      refreshHome(d);
    });
  }

  // Search movieDB for related pictures
  $('#imagesearch').bind('input propertychange', function() {
    document.location.hash = escape($('#imagesearch').val());
    if(document.location.hash.length > 0){
      //console.log($('#imagesearch').val());
      var data = {
        query : $('#imagesearch').val()
      };
      serverRequest('/browse', 'POST', data, function(d){
        //Load new images
        refreshHome(d);
      });
    }
  });

  $('#ratebutton').click(function() {
    var data = {
        id  : moviedata.id,
        title : moviedata.title,
        poster : moviedata.poster_path,
        genres : moviedata.genres,
        val : $('.rating').val()
    };
    serverRequest('/api/rate', 'POST', data, function(d){
      console.log("works");
    });
  });

  // When the prev button is clicked
  $(".gallery__controls-prev").click(function(){
      // Set target item to the item before the active item
      var targetItem = $(".gallery__item--active").prev();
      toGalleryItem(targetItem);
  });

  // When the next button is clicked
  $(".gallery__controls-next").click(function(){
      // Set target item to the item after the active item
      var targetItem = $(".gallery__item--active").next();
      toGalleryItem(targetItem);
  });
});
