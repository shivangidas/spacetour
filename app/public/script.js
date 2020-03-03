"use strict";

$(document).ready(function() {
  $('input[type="text"]').keypress(function(event) {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      $("#searchButton").trigger("click");
    }
  });
  $("#searchButton").click(function() {
    let query = $("#searchQuery").val();
    let url = "https://images-api.nasa.gov/search?q=";
    fetch(url + query)
      .then(response => {
        return response.json();
      })
      .then(data => {
        var items = data.collection.items;
        console.log(data);
        var html = "";
        if (items.length > 0) {
          items.forEach(album => {
            if (album && album.links && album.links[0].href) {
              html += ' <div class="col mb-4">';
              html += '<div class="card">';
              var thumbnail = album.links[0].href;
              var title = album.data[0].title || "";
              var text = album.data[0].description || "";
              var date_created = album.data[0].date_created || "";
              date_created = date_created.split("T")[0];
              html +=
                "<img src='" +
                thumbnail +
                "' alt='" +
                title +
                "' class='responsive card-img-top'/>";
              html += '<div class="card-body">';
              html += '<h5 class="card-title">' + title + "</h5>";
              html += '<p class="card-text">' + text + "</p></div>";
              html +=
                '<div class="card-footer"> <small class="text-muted" >' +
                date_created.toLocaleString() +
                "</small ></div ></div></div>";
            }
          });
        } else {
          html =
            "<div class='col' style='margin-top:10%;'><h3>Nothing in the universe matched your search!</h3></div>";
        }
        var section = document.getElementById("imageThumbnail");
        section.innerHTML = html;
      })
      .catch(err => {
        // Do something for an error here
        console.log(err);
      });
  });
});
