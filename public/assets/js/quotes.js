var PORT = require("../server.js");

// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function () {

  // Capture the DELETE click
  $(".delquote").on("click", function (event) {
    var id = $(this).data("id");

    // Send the DELETE request
    $.ajax("/quotes/" + id, {
      type: "DELETE"
    }).then(
      function () {
        console.log("deleted id ", id);
        //reload page
        location.reload();
      }
    );
  });
  // Capture the ADD click
  $(".create-form").on("submit", function (event) {
    event.preventDefault();

    var newQuote = {
      author: $("#auth").val().trim(),
      quote: $("#quo").val().trim()
    };

    // Send the POST request
    $.ajax("/quotes", {
      type: "POST",
      data: newQuote
    }).then(
      function () {
        console.log("Created a new quote!");
        // reload page
        location.reload();
      });
  });

  // Capture the UPDATE click
  $(".update-form").on("submit", function (event) {
    event.preventDefault();

    var updatedQuote = {
      author: $("#auth").val().trim(),
      quote: $("#quo").val().trim()
    };

    var id = $(this).data("id");


    // Send the POST (Put) request
    $.ajax("/quotes/" + id, {
      type: "PUT",
      data: updatedQuote
    }).then(
      function () {
        console.log("Updated 1 quote!");
        // reload page
        location = "http://localhost:" + PORT;
        location.reload();
      });
  });
})

