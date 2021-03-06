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

//when user enters landing page, clear database contents
app.get('/', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log(err);
            return;
        }
        var dbo = db.db("recipedb");
        var recipes = dbo.collection("recipes");
        var shoppingList = dbo.collection("shoppingList");
        try
        {
            // console.log(reqObj.name);
            recipes.deleteMany({}, function(err, items) {
                if (err) {
                    console.log("Error: " + err);
                } 
                console.log("Cleared recipe collection"); 
            });

            shoppingList.deleteMany({}, function(err, items) {
                if (err) {
                    console.log("Error: " + err);
                } 
                console.log("Cleared shoppingList collection"); 
            });

            db.close(); 
        }
        catch (e)
        {
            console.log("Error trying to clear database");
            console.log(e);
            db.close();
        }

    }); //end connect

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

//gets all recipes that are in the 'recipes' collection and sends them
//as a response to the AJAX call from the favorites page
app.get('/favorites/recipes', function(req, res) {
    console.log("in favorites get endpoint");

    MongoClient.connect(url, function(err, db) {
        if (err) 
        {
            console.log(err);
            return;
        }

        var dbo = db.db("recipedb");
        var recipes = dbo.collection("recipes");

        try
        {
            recipes.find().toArray(function(err, items) {
              if (err) 
              {
                console.log("Error: " + err);
                db.close();
              } 
              else 
              {
                db.close();
                res.send(items);            
              }   
            });
        }
        catch (e)
        {
            console.log("Error trying to find items in database");
            console.log(e);
            db.close();
        }

    }); //end connect
});

//gets all recipes that are in the 'shoppingList' collection and sends them
//as a response to the AJAX call from the shopping list page
app.get("/shoppinglist/recipes", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log(err);
            return;
        }
        var dbo = db.db("recipedb");
        var recipes = dbo.collection("shoppingList");
        try
        {
            recipes.find().toArray(function(err, items) {
                if (err) {
                    console.log("Error: " + err);
                } 
                else {
                    res.send(items);            
                }
                db.close();   
            });
        }
        catch (e)
        {
            console.log("Error trying to find items in database");
            console.log(e);
            db.close();
        }

    }); //end connect
});

//search for post requests on createrecipe
//user saves recipe to their favorites
app.post('/createrecipe', function(req, res) {
    //get request object
    var reqObj = req.body;

    //convert these elements into array (in the form they are sent as
    //comma delimitted strings)
    var ingredientsArray = toArray(reqObj.ingredients);
    reqObj.ingredients = ingredientsArray;

    insertRecipe(reqObj, "recipes");
    res.redirect('createrecipe');
});

//search for post requests on webrecipe
//user saves recipe to their favorites
app.post('/webrecipe', function(req, res) {
    //get request object
    var reqObj = req.body;

    //convert these elements into array (in the form they are sent as
    //comma delimitted strings)
    var ingredientsArray = toArray(reqObj.ingredients);
    reqObj.ingredients = ingredientsArray;
   
    insertRecipe(reqObj, "recipes");

    res.redirect('webrecipe');
});

//search for post requests on favorites 
//user adds recipe to shopping list
app.post('/favorites', function(req, res) {
    //get request object
    var reqObj = req.body;

    //convert these elements into array (in the form they are sent as
    //comma delimitted strings)
    var ingredientsArray = toArray(reqObj.ingredients);
    reqObj.ingredients = ingredientsArray;
   
    insertRecipe(reqObj, "shoppingList");
    console.log("Added " + reqObj.name + " to shopping list");
    console.log(req.body);

    res.redirect('favorites');
});

//endpoint from favorites page, user removes recipe from their favorites
app.post('/remove', function(req, res) {
    //get request object
    var reqObj = req.body;

    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log(err);
            return;
        }
        var dbo = db.db("recipedb");
        var recipes = dbo.collection("recipes");
        try
        {
            console.log(reqObj.name);
            recipes.deleteOne({ name: reqObj.name }, function(err, items) {
                if (err) {
                    console.log("Error: " + err);
                } 
                console.log(reqObj.name + " removed from recipe collection"); 
            });
            db.close(); 
        }
        catch (e)
        {
            console.log("Error trying to delete items from database");
            console.log(e);
            db.close();
        }

    }); //end connect

    res.redirect('favorites');
});

//endpoint from shopping list page, user removes recipe from their shopping list
app.post('/removeShoppingList', function(req, res) {
    //get request object
    var reqObj = req.body;

    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log(err);
            return;
        }
        var dbo = db.db("recipedb");
        var recipes = dbo.collection("shoppingList");
        try
        {
            console.log(reqObj.name);
            recipes.deleteOne({ name: reqObj.name }, function(err, items) {
                if (err) {
                    console.log("Error: " + err);
                } 
                console.log(reqObj.name + " removed from shopping list collection"); 
            });
            db.close(); 
        }
        catch (e)
        {
            console.log("Error trying to find items in database");
            console.log(e);
            db.close();
        }

    }); //end connect

    res.redirect('shoppinglist');
});

//MongoDB functions
function insertRecipe(recipe, collectionName) {
    MongoClient.connect(url, function(err, db) {
        if (err) 
        {
            console.log(err);
            return;
        }
        var dbo = db.db("recipedb");
        var recipes = dbo.collection(collectionName);

        try
        {

            recipes.find({apiId : recipe["apiId"]}).toArray(function(err, items) {

                if (err) 
                {
                    console.log("Error: " + err);
                } 
                else 
                {
                    //only add API recipe to database if it doesn't already exist, add user recipe always
                    if (recipe.userRecipe == "true" || (recipe.userRecipe == "false" && items.length === 0)) {
                        recipes.insertOne(recipe);
                        console.log(recipe["name"] + " added.");
                    }
                    else 
                    {
                        console.log(recipe["name"] + " already exists. Not added.");
                    }
                }

                db.close();
            }); //end find
        }
        catch (e)
        {
            console.log("Error trying to insert in database");
            console.log(e);
        }

    }); //end connect
    return;
}

//convert strings to arrays for storage in Mongo
function toArray(commaDelimitedString)
{
    return commaDelimitedString.split(",");
}
