function Recipe(apiId, name, dishTypes, cuisineTypes, instructions, ingredients, source, photo)
{
	//integer
	this.apiId = apiId;
	//string
	this.name = name;
	//array of strings
	this.dishTypes = dishTypes;
	//array of strings
	this.cuisineTypes = cuisineTypes;
	//formatted string
	this.instructions = instructions;
	//array of strings
	this.ingredients = ingredients;
	//string
	this.source = source;
	//string
	this.image = photo;
	//boolean
	this.favorite = false;
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

	return new Recipe(recipe["idMeal"], recipe["strMeal"], recipe["strCategory"].split(","), 
					  recipe["strArea"].split(","), recipe["strInstructions"], ingredients, 
					  recipe["strSource"], recipe["strMealThumb"]);
}

function recipeToString(recipe)
{
	html = "<div class='recipeDisplayContainer'>";
	nameString = "<h1 class='recipeName'>" + recipe.name + "</h1>";
	dishTypeString = recipe.dishTypes.length == 0 ? "" :
					"<h3 class='recipeDishTypes'>Dish type(s): " + arrayToString(recipe.dishTypes) + "</h3>";
	cuisineTypeString = recipe.cuisineTypes.length == 0 ? "" :
					"<h3 class='recipeCuisineTypes'>Cuisine type(s): " + arrayToString(recipe.cuisineTypes) + "</h3>";
	imageString = "&nbsp <img style='width: 150px' src='" + recipe.image + "'/>";
	ingredientsString = "<h3> Ingredients </h3>" + arrayToUnorderedList(recipe.ingredients);
	instructionsString = "<p class='instructions'> <h3> Instructions </h3>" + recipe.instructions + "</p>";

	// favoriteHiddenDiv = "<input type='text' name='favorite' id='favoriteId' style='display:none' />";
	html += nameString + dishTypeString + cuisineTypeString +  imageString + ingredientsString + instructionsString;
	html += "</div>"

	return html;
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
	result = "<ul>";

	for (i = 0; i < array.length; i++)
	{
		result += "<li>" + array[i] + "</li>";
	}

	result += "</ul>";

	return result;
}