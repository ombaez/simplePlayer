$(function() {
  var audio = $("audio");

  function loadSongs() {
    $.ajax({
      url: "/songs"
    })
      .done(function(songs) {
        var list = $(".songsList");
        list.empty();
        songs.forEach(function(elem) {
          var newElem = $('<li class="song">' + elem.nombre + "</li>");
          newElem.on("click", elem, play).appendTo(list);
        });
      })
      .fail(() => alert("Load Fail"));
  }

  function play(event) {
    audio[0].pause();
    audio.attr("src", "/songs/" + event.data.nombre);
    audio[0].play();
  }
  loadSongs();
});
