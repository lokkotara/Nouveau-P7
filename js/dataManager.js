let src;
let recipes = null;
let recipesToDisplay = null;
let tagsListsToDisplay = {
  ingredients: [],
  ustensils: [],
  appliances: [],
};

const setDataManagerSource = (source) => (src = source);

const initDataManager = async () => {
  try {
    const response = await fetch(src);
    recipes = await response.json();
    formatRecipes(recipes);
    console.log(recipes);
    recipesToDisplay = recipes;
  } catch (error) {
    console.error(error);
  }
};

const getAllRecipes = async () => {
  if (!recipes) await initDataManager();
  return recipesToDisplay;
};

/**
 * It takes a string, splits it into an array of words, filters out words that are less than 3
 * characters, then filters the recipes array to only include recipes that have at least one of the
 * words in the title, description, or ingredients.
 * 
 * @param {string} searchValue - the value of the search input
 * @returns {object[]} An array of recipes that match the search value
 */
const filterSearch = (searchValue) => {
  // console.time("filterSearch");
  const words = searchValue.split(" ");
  const filteredWords = words.filter((word) => word.length >= 3);
  recipesToDisplay = recipes.filter((recipe) => {
    const title = recipe.name.toLowerCase();
    const description = recipe.description.toLowerCase();
    const ingredients = recipe.ingredientsArray;
    return filteredWords.every(
      (word) =>
        title.includes(word) ||
        description.includes(word) ||
        ingredients.includes(word)
    );
  });
  // console.timeEnd("filterSearch");
  return recipesToDisplay;
};

/**
 * It takes a recipe object, and adds an ingredientsArray property to it based on its ingredients 
 * @param {object} recipe - a recipe object
 */
const addIngredientsArray = (recipe) => {
  const ingredientsArray = [];
  for (const ingredients of recipe.ingredients) {
    const splitIngredient = ingredients.ingredient.split(" ");
    const formattedIngredient = splitIngredient.map((word) => word);
    ingredientsArray.push(formattedIngredient.join(" "));
  }
  recipe.ingredientsArray = ingredientsArray;
};

const formatRecipes = (recipes) => {
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
const getFormattedList = (array) => {
    const formattedList = new Set();
      array.flat().forEach((string) => {
        formattedList.add(string.toLowerCase());
      });
    return [...formattedList]
      .sort((a, b) => a.localeCompare(b))
      .map((string) => string.charAt(0).toUpperCase() + string.slice(1));
}

/**
 * It takes an array of arrays, and returns an array of unique values.
 * @returns {{ingredients: string[], ustensils: string[], appliances: string[]}} An object with 3 properties: ingredients, ustensils, appliances.
 */
const getTagsToDisplay = () => {
  const ustensilsArray = recipesToDisplay.map((recipe) => recipe.ustensils);
  const ingredientsArray = recipesToDisplay.map((recipe) => recipe.ingredientsArray);
  const appliancesArray = recipesToDisplay.map((recipe) => recipe.appliance.toLowerCase());
  tagsListsToDisplay = {
    ingredients: getFormattedList(ingredientsArray),
    ustensils: getFormattedList(ustensilsArray),
    appliances: getFormattedList(appliancesArray)
  };
  return tagsListsToDisplay;
};

export {
  setDataManagerSource,
  initDataManager,
  getAllRecipes,
  filterSearch,
  getTagsToDisplay,
};