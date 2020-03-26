"use strict";

$(document).ready(function() {
  $("#loginButton").click(function(e) {
    $("#message").addClass("hidden");
    var username = $('input[name="username"').val();
    var password = $('input[name="password"').val();
    if (username == "" || password == "") {
      $("#message").text("Please enter username and password");
      $("#message").removeClass("hidden");
      return;
    }
    $.ajax({
      url: "/login",
      type: "POST",
      data: { username: username, password: password },
      success: function(result) {
        window.location.href = "../search";
      },
      error: function(error) {
        console.log(error.responseJSON.message);
        $("#message").text(error.responseJSON.message);
        $("#message").removeClass("hidden");
        $('input[name="password"').val("");
      }
    });
  });

  $("#signupButton").click(function(e) {
    $("#message").addClass("hidden");
    var username = $('input[name="username"').val();
    var password = $('input[name="password"').val();
    if (username == "" || password == "") {
      $("#message").text("Please enter username and password");
      $("#message").removeClass("hidden");
      return;
    }
    $.ajax({
      url: "/signup",
      type: "POST",
      data: { username: username, password: password },
      success: function(result) {
        window.location.href = "../search";
      },
      error: function(error) {
        console.log(error.responseJSON.message);
        $("#message").text(error.responseJSON.message);
        $("#message").removeClass("hidden");
        $('input[name="password"').val("");
      }
    });
  });
});
