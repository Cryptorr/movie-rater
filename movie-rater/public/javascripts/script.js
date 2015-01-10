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
        //Change gallery width on image load
        totalWidth = totalWidth + $(this).parent().parent().outerWidth(true);
        $(".gallery").width(totalWidth);
        maxScrollPosition = totalWidth - $(".gallery-wrap").outerWidth();
      }).appendTo(
        $("<a/>").attr("class", "gallery__link").attr("href", '/movie/' + results.id)
        .appendTo(
          $("<div/>").attr("class", "gallery__item")
          .appendTo("#movie-results")));
           $("<div/>").attr("class", "gallery__item__title")
            .append(results.title)
            .append("<br><br><br><br><br><br>")
            .appendTo("#movie-results");
          console.log(results.title);
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
