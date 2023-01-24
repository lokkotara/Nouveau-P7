import {
  getAllRecipes,
  getTagsToDisplay,
  filterSearch,
  updateSearchValue,
  consoleActiveTags,
  resetRecipesToDisplay
} from "../dataManager.js";
import {
  createFilters,
  updateFilters,
  updateDatasFilters,
} from "../components/filter.js";

export default async function initPage() {
  let recipes = await getAllRecipes();
  const { ustensils, appliances, ingredients } = getTagsToDisplay();
  displayRecipes(recipes);
  createFilters(ustensils, appliances, ingredients);
}

const displayRecipes = (recipes) => {
  showAllRecipes(recipes);
  listenSearchInput(recipes);
};

const listenSearchInput = (recipes) => {
  const searchInput = document.getElementById("searchInput");
  searchInput.value = "";
  searchInput.addEventListener("input", (event) => {
    updateSearchValue(event.target.value.toLowerCase());
    consoleActiveTags();
    if (event.target.value.length >= 3) {
      const recipesToDisplay = filterSearch();
      showAllRecipes(recipesToDisplay);
      const { ustensils, appliances, ingredients } = getTagsToDisplay();
      // createFilters(ustensils, appliances, ingredients);
      updateDatasFilters(
        { name: "ustensils", array: ustensils },
        { name: "appliances", array: appliances },
        { name: "ingredients", array: ingredients }
      );
    } else {
      resetRecipesToDisplay();
      showAllRecipes(filterSearch());
      const { ustensils, appliances, ingredients } = getTagsToDisplay();
      // createFilters(ustensils, appliances, ingredients);
      updateDatasFilters(
        { name: "ustensils", array: ustensils },
        { name: "appliances", array: appliances },
        { name: "ingredients", array: ingredients }
      );
    }
  });
};

function templateEmpty() {
  return `
  <div class="d-flex w-100">Aucune recette ne correspond à votre critère... Vous pouvez chercher "tarte aux pommes", "poisson", etc.</div>
  `;
}

function templateRecipe(recipe) {
  return `
  <article class="recipeCard rounded d-flex flex-column mb-5 overflow-hidden">
    <div class="h-50">
      <img  src="https://dummyimage.com/380/dedede/dedede" alt="${
        recipe.name
      }" class="h-100 w-100">
    </div>
    <div class="d-flex flex-column recipeCardText h-50">
      <div class="d-flex justify-content-between p-2 px-4 align-items-center">
        <span class="recipeCardName">${recipe.name}</span>
        <span class="cardTimeContainer">
          <span class="far fa-clock"></span>
          <span class="recipeCardTime fw-bold">${recipe.time} min</span>
        </span>
      </div>
      <div class="d-flex justify-content-between p-2 px-4 recipeCardContent">
        <ul class="w-50 list-unstyled">
          ${displayIngredients(recipe.ingredients)}
        </ul>
        <span class="w-50 ellipsis">${recipe.description}</span>
      </div>
    </div>
  </article>
    `;
}

/**
 * It takes an array of objects, and returns a string of HTML
 * @param {Array<{ingredient: string, quantity: number, unit: string}>} ingredients - an array of objects.
 * @returns the htmlContent variable.
 */
function displayIngredients(ingredients) {
  let htmlContent = "";
  for (const elt of ingredients) {
    htmlContent += `
      <li><span class="fw-bold">${elt.ingredient}</span>${
      elt.quantity ? ": " + elt.quantity : ""
    } ${elt.unit ? elt.unit : ""}</li>
      `;
  }
  return htmlContent;
}

/**
 * It takes an array of recipes, checks if it's empty, and if it's not, it loops through the array and
 * adds each recipe to the DOM.
 * @param {object[]} recipes - an array of objects
 */
export function showAllRecipes(recipes) {
  const isRecipesEmpty = recipes.length === 0;
  const DOM = document.querySelector(".recipesContainer");
  let content = "";
  try {
    if (isRecipesEmpty) content = templateEmpty();
    else {
      for (const recipe of recipes) {
        content += templateRecipe(recipe);
      }
    }
  } catch (error) {
    console.error(error);
  }
  DOM.innerHTML = content;
}


