"use strict";
fetch("https://images-api.nasa.gov/search?q=earth")
  .then(response => {
    return response.json();
  })
  .then(data => {
    var items = data.collection.items;
    console.log(data);
    if (items.length > 0) {
      var html = "";

      items.forEach(album => {
        html += "<div class='col-3'>";
        var thumbnail = album.links[0].href;
        var title = album.data[0].title;
        html +=
          "<img src='" +
          thumbnail +
          "' alt='" +
          title +
          "' class='responsive'/></div>";
      });

      var section = document.getElementById("imageThumbnail");
      section.innerHTML = html;
    }
  })
  .catch(err => {
    // Do something for an error here
  });
