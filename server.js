var express = require("express");
var bodyParser = require("body-parser");

var app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;

// Use the express.static middleware to serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "quotes_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// Express and MySQL code should go here.
// Use Handlebars to render the main index.html page with the quotes in it.
app.get("/", function(req, res) {
  connection.query("SELECT * FROM quotes;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }

    res.render("index", { quotes: data });
  });
});

// Show individual quote and form to update
app.get("/:id", function (req, res) {
  connection.query("SELECT * FROM quotes where id = ?", [req.params.id], function (err, data) {
    if (err) {
      return res.status(500).end();
    }
    console.log(data);
    res.render("single-quote", data[0]);
  });
});

// POST NEW QUOTE ROUTE
app.post("/quotes", function(req, res) {
  connection.query("INSERT INTO quotes (author, quote) VALUES (?, ?)", [req.body.author, req.body.quote], function(err, result) {
    if(err) {
      return res.status(500).end();
    }
    // return the ID of the new quote
    res.json({ id: result.insertId });
    console.log({ id: result.insertId });
  });
});

// GET ALL QUOTES ROUTE: WORKS!
app.get("/quotes", function(req, res) {
  connection.query("SELECT * FROM quotes;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }
    console.log(data);
    res.json(data);
    
  })
})
// UPDATE QUOTES ROUTE
app.put("/quotes/:id", function(req, res) {
  connection.query("UPDATE quotes SET author = ?, quote = ? WHERE id = ?", [req.body.author, req.body.quote, req.params.id], 
  function(err, result) {
    if (err) {
      // If an error occurred, send a generic server failure
      return res.status(500).end();
    }
    else if (result.changedRows === 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    }
    res.status(200).end();
  })
})

// DELETE QUOTE ROUTE
app.delete("/quotes/:id", function(req, res) {
  connection.query("DELETE FROM quotes WHERE id = ?", [req.params.id], function(err, result) {
    if (err) {
      // If an error occurred, send a generic server failure
      return res.status(500).end();
    }
    else if (result.affectedRows === 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    }
    res.status(200).end();
  });
});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});

module.exports = PORT;