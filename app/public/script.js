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
    $("#message").addClass("hidden");
    var query = $("#searchQuery").val();
    if (query.length == 0) {
      $("#message").text("Enter something in the input box");
      $("#message").removeClass("hidden");
      return;
    }
    $("#loader").removeClass("hidden");
    query = query.replace(", ", " ").replace(",", " ");
    var keywords = query.split(" ").join(",");
    let url =
      "https://images-api.nasa.gov/search?media_type=image&q=" +
      query +
      "&keywords=" +
      keywords;
    fetch(url)
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
              if (album.data[0].description) {
                var text =
                  album.data[0].description.replace(/<\/?[^>]+>/gi, " ") || "";

                if (text.length > 100) {
                  text =
                    text.substr(0, 100) +
                    '... <a href="" data-toggle="modal" data-target="#showMoreModal"  data-id="' +
                    album.data[0].nasa_id +
                    '"data-description="' +
                    album.data[0].description.replace(/<\/?[^>]+>/gi, " ") +
                    '">Show more</a >';
                }
              }

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
                '</small > <button type="button" class="btn btn-success btn-sm saveImageButton" >Save</button><input type="hidden" value="' +
                album.data[0].nasa_id +
                '"/>';
              html += "</div ></div ></div > ";
            }
          });
        } else {
          html =
            "<div class='col' style='margin-top:10%;'><h3>Nothing in the universe matched your search!</h3></div>";
        }
        $("#loader").addClass("hidden");
        var section = document.getElementById("imageThumbnail");
        section.innerHTML = html;
      })
      .catch(err => {
        // Do something for an error here
        console.log(err);
      });
  });

  //get db images
  $("#searchDBButton").click(function() {
    $("#message").addClass("hidden");
    var url = "api/v1/image";
    $("#loader").removeClass("hidden");
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        var items = data.result;
        console.log(data);
        var html = "";
        if (items.length > 0) {
          items.forEach(image => {
            html += ' <div class="col mb-4">';
            html += '<div class="card">';
            var thumbnail = image.link;
            var title = image.title || "";
            var text = image.description || "";
            if (text.length > 100) {
              text =
                text.substr(0, 100) +
                '... <a href="" data-toggle="modal" data-target="#showMoreModal" data-id="' +
                image.nasa_id +
                '"data-description="' +
                image.description +
                '">Show more</a >';
            }

            var date_created = image.date_created || "";
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
              date_created +
              '</small > <button type="button" class="btn btn-danger btn-sm deleteImageButton" >Delete</button><input type="hidden" value="' +
              image.id +
              '"/>';
            html += "</div ></div ></div > ";
          });
        } else {
          html =
            "<div class='col' style='margin-top:10%;'><h3>You have not saved anything yet!</h3></div>";
        }
        $("#loader").addClass("hidden");
        var section = document.getElementById("imageThumbnail");
        section.innerHTML = html;
      })
      .catch(err => {
        // Do something for an error here
        console.log(err);
      });
  });
  $("#imageThumbnail").on("click", ".saveImageButton", function(event) {
    event.preventDefault();
    var nasa_id = $(this)
      .siblings("input")
      .val();
    var url = "https://images-api.nasa.gov/search?nasa_id=" + nasa_id;
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        var values = data.collection.items[0].data[0];
        var postdata = {
          nasa_id: values.nasa_id,
          title: values.title,
          description: values.description.replace(/<\/?[^>]+>/gi, " ") || "",
          center: values.center || "",
          link: data.collection.items[0].links[0].href,
          location: values.location || "",
          date_created: values.date_created || ""
        };
        console.log(postdata);
        $.ajax({
          url: "/api/v1/image",
          type: "POST",
          data: postdata,
          success: function(result) {
            // console.log("Saved");
            // console.log(result);
            snackBar("Saved");
          },
          error: function(error) {
            console.log(error);
            if (error.responseJSON && error.responseJSON.message) {
              snackBar(error.responseJSON.message);
            } else {
              snackBar("Could not save. Internal Error.");
            }
          }
        }); /*ajax*/
      })
      .catch(err => {
        // Do something for an error here
        console.log(err);
        snackBar("Can't fetch from NASA api");
      });
  });
  $("#imageThumbnail").on("click", ".deleteImageButton", function(event) {
    event.preventDefault();
    var id = $(this)
      .siblings("input")
      .val();
    $.ajax({
      url: "/api/v1/image/" + id,
      type: "DELETE",

      success: function(result) {
        snackBar("Deleted");
        $("#searchDBButton").trigger("click");
      },
      error: function(error) {
        console.log(error);
        snackBar("Could not delete. Try again.");
      }
    }); /*ajax*/
  });

  $("#showMoreModal").on("show.bs.modal", function(event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var id = button.data("id"); // Extract info from data-* attributes
    var description = button.data("description");
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this);
    modal.find(".modal-title").text("NASA id: " + id);
    modal.find(".modal-body .text_area").html(description);
  });

  //logout
  $("#logout").click(function(event) {
    event.preventDefault();
    $.ajax({
      url: "/api/v1/logout",
      type: "GET",
      headers: { "x-access-token": sessionStorage.getItem("token") },
      success: function(result) {
        sessionStorage.setItem("token", result.token);
        window.location.href = "../logout";
      },
      error: function(error) {
        alert("You are not logged in!");
        sessionStorage.removeItem("token");
        window.location.href = "../logout";
      }
    });
    /*$('#logout').attr('href','../logout');*/
  });
  $(".scrollToTop").hide();
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $(".scrollToTop").fadeIn();
    } else {
      $(".scrollToTop").fadeOut();
    }
  });

  //Click event to scroll to top
  $(".scrollToTop").click(function() {
    $("html, body").animate({ scrollTop: 0 }, 800);
    return false;
  });

  //go back in history
  $(".goBack").click(function(event) {
    event.preventDefault();
    window.history.back();
  });
  function snackBar(message) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    x.innerHTML = message;
    setTimeout(function() {
      x.className = x.className.replace("show", "");
    }, 3000);
  }
});
