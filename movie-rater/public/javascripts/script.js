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

//check if username is valid and passwords are valid/equal
function checkPass(form) {

  return true;
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

  $('#loginform').submit(function(){
    var data={
      name: $('#loginname').val(),
      pass: $('#loginpass').val()
    }
    serverRequest('/api/login', 'POST', data, function(d){
      $('#loginmessage').html("<li>" + d.message + "</li>");
      if(d.message == "Logged in!"){
        location.reload();
      }
    });
    return false;
  });

  $('#registerform').submit(function(){
    var form = this;
    if(form.name.value == "") {
      $('#registermessage').html("Username cannot be blank!");alert();
      form.name.focus();
      return false;
    }
    var re = /^\w+$/;
    if(!re.test(form.name.value)) {
      $('#registermessage').html("Username may only contain letters, numbers and underscores!");
      form.name.focus();
      return false;
    }
    if(form.pass.value == "" || form.pwd2.value == "") {
      $('#registermessage').html("Please fill in both password fields");
      form.pass.focus();
      return false;
    }
    if(form.pass.value != form.pwd2.value) {
      $('#registermessage').html("Passwords were not equal, so no account could be created");
      form.pass.focus();
      return false;
    }
    if(!re.test(form.pass.value)) {
      $('#registermessage').html("Password may only contain letters, numbers and underscores!");
      form.pass.focus();
      return false;
    }
    var data={
      name: $('#inputUser').val(),
      pass: $('#inputPass1').val()
    }

    serverRequest('/api/make_account', 'POST', data, function(d){
      $('#registermessage').html(d.message);
    });
    return false;
  });

  //Display most popular movies on homepage
  serverRequest('/api/toprated', 'GET', data, function(d) {
    console.log(d[0].DBid);
    for (i=0; i<d.length; i++) {
      $(".popularMovies").append(
        $("<div/>").attr("class", "popMovieImg").attr("id", "popMovieImg" + i).append(
          $("<a/>").attr("href", '/movie/' + d[i].DBid).append(
            $("<img/>").attr("src", 'http://image.tmdb.org/t/p/' + 'w185' + d[i].poster)
          )
        )
      );
    };
    $('#home-text').css("visibility", "visible");
  });

  /* needs further work
  //We want to display two rows of 5 popular movies on the homepage if the window resolution is wide enough
  window.onresize = function(event) {
    var w = window.innerWidth;
    console.log(w);
    //if it's wide enough
    if (w>1300) {
      //remove inline-block property to image 5
      //$('#popMovieImg4').css("display" , "block");
    }
    //if it's not wide enough
    else {
      //add inline-block property to image 5
      //$('#popMovieImg4').css("display" , "inline-block");
    }
  };
  */

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
        genres : moviegenres,
        val : $('.rating').val()
    };
    //console.log(data);
    serverRequest('/api/rate', 'POST', data, function(d){
      $('#ratemessage').html(d.message);
    });
  });

  $('#sendcomment').click(function() {
    var data = {
        id  : moviedata.id,
        title : moviedata.title,
        poster : moviedata.poster_path,
        genres : moviegenres,
        content : $('#comment').val(),
        user : "Henk"
    };
    //console.log(data);
    serverRequest('/api/comment', 'POST', data, function(d){
      alert("Thanks for commenting on a movie!");
    });
  });

  if($('#commenttable').length){
    serverRequest('/api/comment/' + moviedata.id, 'GET', "", function(d){
      for(var i = 0; i<d.length; i++){
        $('#commenttable').append("<tr><td>" + d[i].user + "</td><td>" + d[i].content + "</td></tr>");
      }
    });
  }
});
