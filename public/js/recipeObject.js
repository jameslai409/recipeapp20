function Recipe(apiId, name, dishType, cuisineType, instructions, ingredients, source, photo, userRecipe)
{
	//integer
	this.apiId = apiId;
	//string
	this.name = name;
	//string
	this.dishType = dishType;
	//string
	this.cuisineType = cuisineType;
	//formatted string
	this.instructions = instructions;
	//array of strings
	this.ingredients = ingredients;
	//string
	this.source = source;
	//string
	this.image = photo;
	//boolean
	this.userRecipe = userRecipe;
}

//create Recipe object from JSON retrieved from API call 
function createRecipeObject(recipe)
{
	if (recipe["strMeal"].length == 0 || recipe["strInstructions"].length == 0 ||
		recipe["strIngredient1"].length == 0)
	{
		return {};
	}

	ingredients = [];
	index = 1;
	ingredientsLeftToParse = true;
	while (ingredientsLeftToParse)
	{
		ingredientName = "strIngredient" + parseInt(index);
		ingredientQuantity = "strMeasure" + parseInt(index);

		if (recipe[ingredientName] == "" || recipe[ingredientQuantity] == "")
		{
			ingredientsLeftToParse = false;
			break;
		}

		ingredientString = recipe[ingredientQuantity] + " " + recipe[ingredientName];
		ingredients.push(ingredientString);
		index++;

	}

	return new Recipe(recipe["idMeal"], recipe["strMeal"], recipe["strCategory"], 
					  recipe["strArea"], recipe["strInstructions"], ingredients, 
					  recipe["strSource"], recipe["strMealThumb"], false);
}

function recipeToString(recipe)
{
	html = "<div class='recipeDisplayContainer'>";
	nameString = "<h1 class='recipeName'>" + recipe.name + "</h1>";
	// dishTypeString = recipe.dishTypes.length == 0 ? "" :
	// 				"<div class='recipeDishTypes'>Dish type(s): " + arrayToString(recipe.dishTypes) + "</div>";
	// cuisineTypeString = recipe.cuisineTypes.length == 0 ? "" :
	// 				"<div class='recipeCuisineTypes'>Cuisine type(s): " + arrayToString(recipe.cuisineTypes) + "</dic>";
	html2 = "<div class='flex-container'>";
	imageString = recipe.userRecipe === "true" ? "" : "<img class='recipeImg' src='" + recipe.image + "'/>";
	html3 = "<div class='body-container'>";
	instructionsString = "<div class='instructions'>" + recipe.instructions + "</div>";
	ingredientsString = "<div class='ingredients'>" + arrayToUnorderedList(recipe.ingredients) + "</div>";
	// favoriteHiddenDiv = "<input type='text' name='favorite' id='favoriteId' style='display:none' />";
	html += nameString + html2 + imageString + html3 + instructionsString + ingredientsString;
	html += "</div></div>";
	return html;
}

//used to send form data to backend on web_recipe.ejs page when user adds recipe to favorites
function createHiddenForm(recipe)
{
	ingredientsString = arrayToString(recipe.ingredients);

	apiID = "<input type='hidden' name='apiId' value='" + recipe.apiId + "'/>";
	name = "<input type='hidden' name='name' value='" + recipe.name + "'/>";
	dishType = "<input type='hidden' name='dishType' value='" + recipe.dishType + "'/>";
	cuisineType = "<input type='hidden' name='cuisineType' value='" + recipe.cuisineType + "'/>";
	instructions = "<input type='hidden' name='instructions' value='" + recipe.instructions + "'/>";
	ingredients = "<input type='hidden' name='ingredients' value='" + ingredientsString + "'/>";
	source = "<input type='hidden' name='source' value='" + recipe.source + "'/>";
	image = "<input type='hidden' name='image' value='" + recipe.image + "'/>";
	userRecipe = "<input type='hidden' name='userRecipe' value='" + recipe.userRecipe + "'/>";

	hiddenHtml = apiID + name + dishType + cuisineType + instructions + ingredients + source + image + userRecipe;
	return hiddenHtml;
	
}

function arrayToString(array)
{
	result = "";
	for (i = 0; i < array.length; i++)
	{
		result += array[i];
		if (i != array.length - 1)
		{
			result += ", ";
		}
	}

	return result;
}

function arrayToUnorderedList(array)
{
	result = "<div class='list1'><ul>";

	if (array.length <= 9) {
		for (i = 0; i < array.length; i++)
			result += "<li>" + array[i] + "</li>";
		result += "</ul></div>";
	}
	else {
		for (i = 0; i < 9; i++)
			result += "<li>" + array[i] + "</li>";
		result += "</ul></div>";
		result += "<div class='list2><ul>"
		for (i = 9; i < array.length; i++)
			result += "<li>" + array[i] + "</li>";
		result += "</ul></div>";
	}

	return result;
}

//neatly returns in HTML code: recipe name + ingredients in two columns
function printIngredients(recipe) {
	let body = "";
	
	body += "<h3 style='text-align: center'>" + recipe["name"] + "</h3>";
	body += "<br />";
	let ingredients = recipe["ingredients"];

	body += "<div class='container'>";
	body += "<div class='row justify-content-center'>";

	//divide the ingredient list into two
	//print first half of ingredients as one column
	body += "<div class='col-3 offset-md-1 ingredients'>"; //start column 1
	for (let i = 0; i < Math.ceil(ingredients.length / 2); i++) {
		body += ingredients[i] + "<br />";
	}
	body += "</div>"; //end column 1

	//print first half of ingredients as one column
	body += "<div class='col-3 ingredients'>"; //start column 2
	for (let i = Math.ceil(ingredients.length / 2); i < ingredients.length; i++) {
		body += ingredients[i] + "<br />";
	}
	body += "</div>"; //end column 2

	body += "</div>"; //end div class row justify-content-center
	body += "</div>"; //end div container class

	//add some space below each element
	body += "<br />";

	return body;
}