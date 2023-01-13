import {
  getAllRecipes,
  getTagsToDisplay,
  filterSearch,
} from "../dataManager.js";

export default function initPage() {
  displayRecipes();
}

const displayRecipes = async () => {
  let recipes = await getAllRecipes();
  showAllRecipes(recipes);
  listenSearchInput(recipes);
};

const listenSearchInput = (recipes) => {
  const searchInput = document.getElementById("searchInput");
  searchInput.value = "";
  searchInput.addEventListener("input", (event) => {
    if (event.target.value.length >= 3) {
      const recipesToDisplay = filterSearch( event.target.value.toLowerCase());
      //TODO: faire une fonction qui affiche les recettes et met à jour les listes de filtres actifs
      showAllRecipes(recipesToDisplay);
      const { ustensils, appliances, ingredients } = getTagsToDisplay();
      console.log(ustensils, appliances, ingredients);
    } else {
      showAllRecipes(recipes);
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
      <img  src="https://via.placeholder.com/380.jpg?text=${
        recipe.name
      } " alt="${recipe.name}" class="h-100 w-100">
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
function showAllRecipes(recipes) {
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