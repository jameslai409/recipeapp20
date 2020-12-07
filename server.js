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
    });
    req.on("end", function() {
        var recipe = querystring.parse(body);
        insertRecipe(recipe);
    });

    //redirect to same page. gets rid of POST shenanigans (timeouts)
    res.redirect('createrecipe');
    // res.render("create_recipe")
    // alert("Recipe " + recipe["name"] + " added!");

});

//search for post requests on createrecipe (user submits recipe)
app.post('/webrecipe', function(req, res) {
    console.log("in webrecipe endpoint");
    //parses the recipe passed through the POST request
    var body = "";
    req.on('error', function(err) {
      // This prints the error message and stack trace to `stderr`.
      console.error(err.stack);
    });
    req.on("data", function(data) {
        console.log("in req.on 'data'");
        body += data;
    });
    req.on("end", function() {
        console.log("in req.on 'end'");
        var recipe = querystring.parse(body);
        var dishTypesArray = toArray(recipe.dishTypes);
        var cuisineTypesArray = toArray(recipe.cuisineTypes);
        var ingredientsArray = toArray(recipe.ingredients);
        recipe.dishTypes = dishTypesArray;
        recipe.cuisineTypes = cuisineTypesArray;
        recipe.ingredients = ingredientsArray;
        console.log("before insertRecipe");
        insertRecipe(recipe);
    });

    //redirect to same page. gets rid of POST shenanigans (timeouts)
    res.redirect('webrecipe');
    // res.render("create_recipe")
    // alert("Recipe " + recipe["name"] + " added!");

});




//MongoDB functions
function insertRecipe(recipe) {
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

//convert strings to arrays for storage in Mongo
function toArray(commaDelimitedString)
{
    console.log("in toArray");
    return commaDelimitedString.split(",");
}
