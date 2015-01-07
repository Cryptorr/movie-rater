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
  //Fill with Images
  $.each(data, function(i,data){
    if(!data.is_album){
    $("<img/>").attr("src", 'http://image.tmdb.org/t/p/' + data.poster).attr("class", "gallery__img").attr("alt", "")
    .one('load',function() {
      //Change gallery width on image load
      totalWidth = totalWidth + $(this).parent().parent().outerWidth(true);
      $(".gallery").width(totalWidth);
      maxScrollPosition = totalWidth - $(".gallery-wrap").outerWidth();
    }).appendTo(
      $("<a/>").attr("class", "gallery__link").attr("href", '/movie/' + data.title)
      .appendTo(
        $("<div/>").attr("class", "gallery__item").attr("data-content", data.upvotes + ' upvotes')
        .appendTo("#movie-results")));
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
