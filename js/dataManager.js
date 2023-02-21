import {
  updateDatasFilters,
  displaysActiveTags,
} from "./components/filter.js";

import { showAllRecipes } from "./pages/index.js";

let src;
let recipes = null;
let recipesToDisplay = null;
let tagsListsToDisplay = {
  appliances    : [],
  ingredients   : [],
  ustensils     : [],
};
let activeTags = {
  appliances    : [],
  ingredients   : [],
  searchValue   : "",
  ustensils     : [],
};

const setDataManagerSource = (source) => (src = source);

/**
 * It fetches the data from the API, then formats the data and sets the recipesToDisplay variable to
 * the recipes variable.
 */
async function initDataManager() {
  try {
    const response = await fetch(src);
    recipes = await response.json();
    formatRecipes(recipes);
    recipesToDisplay = recipes;
  } catch (error) {
    console.error(error);
  }
};

/**
 * "If the recipes variable is not defined, then initialize the data manager, and then return the
 * recipesToDisplay variable."
 * 
 * The recipesToDisplay variable is defined in the initDataManager function.
 * @returns {object[]} recipesToDisplay
 */
async function getAllRecipes() {
  if (!recipes) await initDataManager();
  return recipesToDisplay;
};

/**
 * It takes a string, splits it into an array of words, filters out words that are less than 3
 * characters, then filters the recipes array to only include recipes that have at least one of the
 * words in the title, description, or ingredients.
 *
 * @returns {object[]} An array of recipes that match the search value
 */
function filterSearch() {
  let filteredWords   = [];
  let tempRecipes     = [];
  const words         = activeTags.searchValue.split(" ");

  for (let i = 0, size = words.length; i < size; i++) {
    if (words[i].length >= 3) filteredWords.push(words[i]);
  }

  for (let i = 0, size = recipes.length; i < size; i++) {
    let match   = true;
    let recipe  = recipes[i];

    for (let j = 0, size = filteredWords.length; j < size; j++) {
      let word = filteredWords[j];
      if (!recipe.name.toLowerCase().includes(word.toLowerCase()) && !recipe.description.toLowerCase().includes(word.toLowerCase())) {
        let ingredientMatch = false;

        for (let k = 0, size = recipe.ingredientsArray.length; k < size; k++) {
          if (recipe.ingredientsArray[k].toLowerCase().includes(word.toLowerCase())) {
            ingredientMatch = true;
            break;
          }
        }
        if (!ingredientMatch) {
          match = false;
          break;
        }
      }
    }
    if (match) {
      tempRecipes.push(recipe);
    }
  }
  recipesToDisplay = filterRecipes(tempRecipes);
  return recipesToDisplay;
};

function filterRecipes(recipesToDisplay) {
  let filteredRecipes = [];
  for (let i = 0; i < recipesToDisplay.length; i++) {
    let recipe = recipesToDisplay[i];

    if (activeTags.ingredients.length > 0) {
      let ingredientMatch = true;
      for (let j = 0; j < activeTags.ingredients.length; j++) {
        if (!recipe.ingredientsArray.includes(activeTags.ingredients[j])) {
          ingredientMatch = false;
          break;
        }
      }
      if (!ingredientMatch) {
        continue;
      }
    }

    if (activeTags.ustensils.length > 0) {
      let ustensilMatch = true;
      for (let j = 0; j < activeTags.ustensils.length; j++) {
        let match = false;
        for (let k = 0; k < recipe.ustensils.length; k++) {
          if (recipe.ustensils[k].toLowerCase() === activeTags.ustensils[j]) {
            match = true;
            break;
          }
        }
        if (!match) {
          ustensilMatch = false;
          break;
        }
      }
      if (!ustensilMatch) {
        continue;
      }
    }

    if (activeTags.appliances.length > 0) {
      let applianceMatch = false;
      for (let j = 0; j < activeTags.appliances.length; j++) {
        if (recipe.appliance.toLowerCase() === activeTags.appliances[j]) {
          applianceMatch = true;
          break;
        }
      }
      if (!applianceMatch) {
        continue;
      }
    }
    filteredRecipes.push(recipe);
  }
  return filteredRecipes;
}

/**
 * It takes a recipe object, and adds an ingredientsArray property to it based on its ingredients
 * @param {object} recipe - a recipe object
 */
function addIngredientsArray(recipe) {
  const ingredientsArray = [];
  for (const ingredients of recipe.ingredients) {
    const splitIngredient = ingredients.ingredient.split(" ");
    const formattedIngredient = splitIngredient.map((word) =>
      word.toLowerCase()
    );
    ingredientsArray.push(formattedIngredient.join(" "));
  }
  recipe.ingredientsArray = ingredientsArray;
};

/**
 * It takes an array of recipes, and for each recipe, it adds an array of ingredients to the recipe.
 * @param {object[]} recipes - an array of objects
 */
function formatRecipes (recipes) {
  for (const recipe of recipes) {
    addIngredientsArray(recipe);
  }
};

/**
 * It takes an array, flattens it if necessary, removes duplicates, sorts it, and capitalizes
 * the first letter of each string. It returns an array of formatted strings.
 * @param {string[][]|string[]} array - the array of arrays that you want to flatten and format
 * @returns {[string]}An array of sorted strings.
 */
function getFormattedList(array) {
  const formattedList = new Set();
  array.flat().forEach((string) => {
    formattedList.add(string.toLowerCase());
  });
  return [...formattedList]
    .sort((a, b) => a.localeCompare(b))
    .map((string) => string.charAt(0).toUpperCase() + string.slice(1));
};

/**
 * It takes an array of arrays, and returns an array of unique values.
 * @returns {{ingredients: string[], ustensils: string[], appliances: string[]}} An object with 3 properties: ingredients, ustensils, appliances.
 */
function getTagsToDisplay() {
  const ustensilsArray = recipesToDisplay.map((recipe) => recipe.ustensils);
  const ingredientsArray = recipesToDisplay.map(
    (recipe) => recipe.ingredientsArray
  );
  const appliancesArray = recipesToDisplay.map((recipe) =>
    recipe.appliance.toLowerCase()
  );
  tagsListsToDisplay = {
    appliances    : filterByApplianceSearch(getFormattedList(appliancesArray)),
    ingredients   : filterByIngredientSearch(getFormattedList(ingredientsArray)),
    ustensils     : filterByUstensilSearch(getFormattedList(ustensilsArray)),
  };
  return tagsListsToDisplay;
};

/**
 * If there is no search value, return all ingredients, otherwise return only the ingredients that
 * contain the search value.
 * @param {string[]} ingredients - an array of strings
 * @returns {string[]} The filtered array of ingredients.
 */
function filterByIngredientSearch(ingredients) {
  const searchValue = document.getElementById("ingredientsFilterInput");
  if (!searchValue) return ingredients;
  else {
    return ingredients.filter((ingredient) =>
      ingredient.toLowerCase().includes(searchValue.value.toLowerCase()));
  }
}

/**
 * If the searchValue is not null, then return the ustensils that include the searchValue.
 * @param {string[]} ustensils - the array of ustensils
 * @returns {string[]} An array of strings.
 */
function filterByUstensilSearch(ustensils) {
  const searchValue = document.getElementById("ustensilsFilterInput");
  if (!searchValue) return ustensils;
  else {
    return ustensils.filter((ustensil) =>
      ustensil.toLowerCase().includes(searchValue.value.toLowerCase()));
  }
}

/**
 * If there is no search value, return all appliances, otherwise return only the appliances that match
 * the search value.
 * @param {string[]} appliances - an array of strings
 * @returns {string[]} The filtered array of appliances.
 */
function filterByApplianceSearch(appliances) {
  const searchValue = document.getElementById("appliancesFilterInput");
  if (!searchValue) return appliances;
  else {
    return appliances.filter((appliance) =>
      appliance.toLowerCase().includes(searchValue.value.toLowerCase())
    );
  }
}

/**
 * It sets the value of recipesToDisplay to the result of the filterSearch function.
 */
function resetRecipesToDisplay() {
  recipesToDisplay = filterSearch();
}

/**
 * It adds a tag to the activeTags object and remove it from the tagsListsToDiplay concerned filter, then filters the recipes and updates the tags and recipes to display.
 * @param {string} name - the name of the tag to add
 * @param {string} list - the name of the list of tags to add the tag to
 */
function addTag(name, list) {
  if (!activeTags[list].includes(name)) activeTags[list].push(name);
  filterSearch();
  getTagsToDisplay();
  displaysActiveTags(activeTags);
  showAllRecipes(recipesToDisplay);
  const index = tagsListsToDisplay[list].indexOf(
    name.charAt(0).toUpperCase() + name.slice(1)
  );
  if (index > -1) {
    tagsListsToDisplay[list].splice(index, 1);
    const { ingredients, ustensils, appliances } = tagsListsToDisplay;
    updateDatasFilters(
      { name: "ustensils", array: ustensils },
      { name: "appliances", array: appliances },
      { name: "ingredients", array: ingredients }
    );
  }
}

/**
 * It removes a tag from the activeTags array and adds it to the tagsListsToDisplay array, filters the recipes and then update the
 * recipes and the filters.
 * @param {string} name - the name of the tag to remove
 * @param {string} list - the name of the list of tags to remove the tag from
 */
function removeTag(name, list) {
  const index = activeTags[list].indexOf(name);
  const tagToRemove = activeTags[list].splice(index, 1);
  tagsListsToDisplay[list].push(tagToRemove[0]);
  filterSearch();
  getTagsToDisplay();
  showAllRecipes(recipesToDisplay);
  displaysActiveTags(activeTags);
      const { ingredients, ustensils, appliances } = tagsListsToDisplay;
      updateDatasFilters(
        { name: "ustensils", array: ustensils },
        { name: "appliances", array: appliances },
        { name: "ingredients", array: ingredients }
      );
}

/**
 * It filters out the items in the array that are in the activeTags array.
 * @param {string[]} array - the array of items to filter
 * @param {string} name - the name of the tag
 * @returns {string[]} The filtered array.
 */
function filterListWithActiveTags(array, name) {
  return array.filter((item) => !activeTags[name].includes(item.toLowerCase()));
}

/**
 * It takes a value, and sets the searchValue property of the activeTags object to that value.
 * @param {string} value - The value of the search input
 */
function updateSearchValue(value) {
  activeTags.searchValue = value;
}

/**
 * It takes a filterName and a filterValue as arguments, gets the tags to display, and then filters the
 * tags to display based on the filterName and filterValue.
 * @param {string} filterName - "ingredients"
 * @param {string} filterValue - the value that the user is typing in the search bar
 * @returns {string[]} An array of strings.
 */
function filterTagSearch (filterName, filterValue) {
  getTagsToDisplay();
  if (filterName === "ingredients") {
    return tagsListsToDisplay.ingredients.filter((ingredient) => ingredient.toLowerCase().includes(filterValue.toLowerCase()))
  } else if (filterName === "ustensils") {
    return tagsListsToDisplay.ustensils.filter((ustensil) => ustensil.toLowerCase().includes(filterValue.toLowerCase()))
  } else if (filterName === "appliances") {
    return tagsListsToDisplay.appliances.filter((appliance) => appliance.toLowerCase().includes(filterValue.toLowerCase()))
  }
}

export {
  setDataManagerSource,
  initDataManager,
  getAllRecipes,
  filterSearch,
  getTagsToDisplay,
  resetRecipesToDisplay,
  addTag,
  filterListWithActiveTags,
  updateSearchValue,
  removeTag,
  filterTagSearch,
};
