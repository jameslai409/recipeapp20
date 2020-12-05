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
	// dishTypeString = recipe.dishTypes.length == 0 ? "" :
	// 				"<div class='recipeDishTypes'>Dish type(s): " + arrayToString(recipe.dishTypes) + "</div>";
	// cuisineTypeString = recipe.cuisineTypes.length == 0 ? "" :
	// 				"<div class='recipeCuisineTypes'>Cuisine type(s): " + arrayToString(recipe.cuisineTypes) + "</dic>";
	html2 = "<div class='flex-container'>";
	imageString = "<img class='recipeImg' src='" + recipe.image + "'/>";
	html3 = "<div class='body-container>";
	instructionsString = "<div class='instructions'>" + recipe.instructions + "</div>";
	html4 = "<div class='flex-container2'>";
	ingredientsString = "<div class='ingredients'>" + arrayToUnorderedList(recipe.ingredients) + "</div>";

	// favoriteHiddenDiv = "<input type='text' name='favorite' id='favoriteId' style='display:none' />";
	html += nameString + html2 + imageString + html3 + instructionsString + html4 + ingredientsString;
	html += "</div></div>";
	html += "</div>";

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
		result += "</ul></div>"
	}

	return result;
}
