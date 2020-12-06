//variables for MongoDB
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = "mongodb+srv://recipeappuser:recipeapppassword@recipeappcluster.vvovx.mongodb.net";

//modules
var express = require('express');
var app = express();
var querystring = require('querystring') //for extracting POST data

//heroku chooses the port. if not supplied, its 8080
var port = process.env.PORT || 8080;

//render ejs files as html
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

// set routes
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/favorites', function(req, res) {
    res.render('favorites');
});

app.get('/shoppinglist', function(req, res) {
    res.render('shopping_list');
});

app.get('/webrecipe', function(req, res) {
    res.render('web_recipe');
});

app.get('/createrecipe', function(req, res) {
    res.render('create_recipe');
});


//search for post requests on createrecipe (user submits recipe)
app.post('/createrecipe', function(req, res) {
    //parses the recipe passed through the POST request
    var body = "";
    req.on("data", function(data) {
        body += data;
    })
    req.on("end", function() {
        var recipe = querystring.parse(body);
        insertRecipe(recipe);
    })

    //redirect to same page. gets rid of POST shenanigans (timeouts)
    res.redirect('createrecipe');
    
});




//MongoDB functions
function insertRecipe(recipe) {

    console.log("THE RECIPE name IS " + recipe["name"]);
    console.log("THE RECIPE cuisine_type IS " + recipe["cuisine_type"]);
    console.log("THE RECIPE prep_time IS " + recipe["prep_time"]);
    console.log("THE RECIPE ingredients IS " + recipe["ingredients"]);
    console.log("THE RECIPE steps IS " + recipe["steps"]);

    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log(err);
            return;
        }
        var dbo = db.db("recipedb");
        var recipes = dbo.collection("recipes");
        
        // recipes.insertOne({"title":"FirstOne", "artist":"myself"});
        recipes.insertOne(recipe);
        console.log(recipe["name"] + " added.");

        db.close();
    });
    return;
}
