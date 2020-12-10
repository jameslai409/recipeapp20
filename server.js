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

//gets all recipes that are in the database and sends them
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

app.get("/shoppinglist/recipes", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log(err);
            return;
        }
        var dbo = db.db("recipedb");
        var recipes = dbo.collection("recipes");
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

//search for post requests on createrecipe (user submits recipe)
app.post('/createrecipe', function(req, res) {
    //get request object
    var reqObj = req.body;

    //convert these elements into array (in the form they are sent as
    //comma delimitted strings)
    var ingredientsArray = toArray(reqObj.ingredients);
    reqObj.ingredients = ingredientsArray;

    insertRecipe(reqObj);
    res.redirect('createrecipe');
});

//search for post requests on webrecipe (user submits recipe)
app.post('/webrecipe', function(req, res) {
    //get request object
    var reqObj = req.body;

    //convert these elements into array (in the form they are sent as
    //comma delimitted strings)
    var ingredientsArray = toArray(reqObj.ingredients);
    reqObj.ingredients = ingredientsArray;
   
    insertRecipe(reqObj);

    res.redirect('webrecipe');
});

//search for post requests on webrecipe (user submits recipe)
app.post('/favorites', function(req, res) {
    // //get request object
    // var reqObj = req.body;

    // //convert these elements into array (in the form they are sent as
    // //comma delimitted strings)
    // var ingredientsArray = toArray(reqObj.ingredients);
    // reqObj.ingredients = ingredientsArray;
   
    // insertRecipe(reqObj);
    console.log("in favorites endpoint after clicking add to shoppinglist");
    console.log(req.body);

    res.redirect('favorites');
});

//MongoDB functions
function insertRecipe(recipe) {
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

// function getAllRecipes() {
//     MongoClient.connect(url, function(err, db) {
//         if (err) 
//         {
//             console.log(err);
//             return;
//         }

//         var dbo = db.db("recipedb");
//         var recipes = dbo.collection("recipes");

//         try
//         {
//             console.log("in getAllRecipes()");
//             recipes.find().toArray(function(err, items) {
//               if (err) 
//               {
//                 console.log("Error: " + err);
//                 db.close();
//               } 
//               else 
//               {
//                 db.close();
//                 return items;         
//               }   
//             });
//         }
//         catch (e)
//         {
//             console.log("Error trying to insert in database");
//             console.log(e);
//             db.close();
//         }

//     }); //end connect
//     return;
// }

//convert strings to arrays for storage in Mongo
function toArray(commaDelimitedString)
{
    // console.log("in toArray");
    return commaDelimitedString.split(",");
}
