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

//for extracting POST data
app.use(express.urlencoded({ extended: false }));

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

//search for post requests on webrecipe (user submits recipe)
app.post('/webrecipe', function(req, res) {
    //get request object
    var reqObj = req.body;

    //convert these elements into arrays (in the form they are sent as
    //comma delimitted strings)
    var dishTypesArray = toArray(reqObj.dishTypes);
    var cuisineTypesArray = toArray(reqObj.cuisineTypes);
    var ingredientsArray = toArray(reqObj.ingredients);
    reqObj.dishTypes = dishTypesArray;
    reqObj.cuisineTypes = cuisineTypesArray;
    reqObj.ingredients = ingredientsArray;
   
    insertRecipe(reqObj);

    res.redirect('webrecipe');
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

        recipes.find({apiId : recipe["apiId"]}).toArray(function(err, items) {

            if (err) 
            {
                console.log("Error: " + err);
            } 
            else 
            {
                //only add recipe to database if it doesn't already exist
                if (items.length === 0) {
                    recipes.insertOne(recipe);
                    console.log(recipe["name"] + " added.");
                }
                else 
                {
                    console.log(recipe["name"] + "already exists. Not added.");
                }
            }

        }); //end find

        // recipes.insertOne({"title":"FirstOne", "artist":"myself"});
        // recipes.insertOne(recipe);
        // console.log(recipe["name"] + " added.");

        db.close();
    }); //end connect
    return;
}

//convert strings to arrays for storage in Mongo
function toArray(commaDelimitedString)
{
    console.log("in toArray");
    return commaDelimitedString.split(",");
}
