import {
  addTag,
  getTagsToDisplay,
  filterListWithActiveTags,
  filterTagSearch,
  removeTag,
} from "../dataManager.js";

let activeFilter = "";

/**
 * It creates the 3 filters.
 * @param {string[]} array1 - an array of strings
 * @param {string[]} array2 - ["Four", "Casserole", "Couteau", "Planche à découper", "Saladier"]
 * @param {string[]} array3 - ["Ingrédient 1", "Ingrédient 2", "Ingrédient 3", "Ingrédient 4"]
 */
function createFilters(array1, array2, array3) {
  const filterContainerWrapper = document.getElementById(
    "filterContainerWrapper"
  );
  filterContainerWrapper.innerHTML = "";
  createSingleFilter(
    "ingredients",
    "Ingrédients",
    array3,
    filterContainerWrapper,
    "Rechercher un ingrédient"
  );
  createSingleFilter(
    "appliances",
    "Appareils",
    array2,
    filterContainerWrapper,
    "Rechercher un appareil"
  );
  createSingleFilter(
    "ustensils",
    "Ustensiles",
    array1,
    filterContainerWrapper,
    "Rechercher un ustensile"
  );
}

/**
 * It takes three arrays as arguments, and updates the data of the filters with the values of the
 * arrays.
 * @param {object} array1 - {array: [], name: ''}
 * @param {object} array2 - {array: [], name: ''}. is facultative
 * @param {object} array3 - {array: [], name: ''}. is facultative
 */
function updateDatasFilters(array1, array2, array3) {
  updateSingleFilterDatas(array1.array, array1.name);
  array2 && updateSingleFilterDatas(array2.array, array2.name);
  array3 && updateSingleFilterDatas(array3.array, array3.name);
}

function updateFilters(array1, array2, array3) {
  updateSingleFilter(array1.array, array1.name);
  updateSingleFilter(array2.array, array2.name);
  updateSingleFilter(array3.array, array3.name);
}

/**
 * It creates a list of items based on the active tags and the name of the filter
 * @param {string[]} array - the array of items to display
 * @param {string} name - the name of the filter
 */
function updateSingleFilterDatas(array, name) {
  const arrayToUse = filterListWithActiveTags(array, name);
  const filterListContainer = document.getElementById(
    `${name}FilterListContainer`
  );
  if (arrayToUse.length > 0) {
    const ul = createFilterUl(name);
    arrayToUse.forEach((item) => {
      const li = createFilterLi(item, name);
      ul.appendChild(li);
    });
    filterListContainer.replaceChild(ul, filterListContainer.childNodes[0]);
  } else {
    const message = document.createElement("p");
    message.classList.add("filterListMessage", "mt-2");
    message.innerHTML = "Aucun résultat";
    filterListContainer.replaceChild(
      message,
      filterListContainer.childNodes[0]
    );
  }
}

/**
 * If the filter is active, show the filter list, otherwise hide it.
 * @param {string[]} array - the array of data to be used to populate the filter list
 * @param {string} name - the name of the filter
 */
function updateSingleFilter(array, name) {
  updateSingleFilterDatas(array, name);
    if(activeFilter===name) {
      toggleFilterListContainer(name,true);
      toggleFilterIcon(name,true);
      toggleFilterContainer(name,true);
      toggleFilterInput(name,true);
    }
    else {
      toggleFilterListContainer(name,false);
      toggleFilterIcon(name,false);
      toggleFilterContainer(name,false);
      toggleFilterInput(name,false);
    }
}

/**
 * It creates a filter 
 * @param {string} name - the name of the filter
 * @param {string} displayName - The name of the filter that will be displayed on the page.
 * @param {string[]} arrayOfItems - an array of strings that will be used to create the list items
 * @param {HTMLElement} container - the container that the filter will be appended to
 * @param {string} placeholder - the text that appears in the input field
 */
function createSingleFilter(name, displayName, arrayOfItems, container, placeholder) {
  const filterContainer       = createFilterContainer(name);
  const label                 = createFilterLabel();
  const divInput              = createFilterDivInput(name);
  const input                 = createFilterInput(name, placeholder);
  const span                  = createFilterSpan(name,displayName);
  const i                     = createFilterIcon(name);
  const filterListContainer   = createFilterListContainer(name);
  const ul                    = createFilterUl(name);
  
  arrayOfItems.forEach((item) => {
    const li = createFilterLi(item, name);
    ul.appendChild(li);
  });

  divInput.appendChild(input);
  divInput.appendChild(span);
  divInput.appendChild(i);
  filterContainer.appendChild(label);
  label.appendChild(divInput);
  label.appendChild(filterListContainer);
  filterListContainer.appendChild(ul);
  container.appendChild(filterContainer);
}

function toggleFilterContainer(filterName, isOpen) {
  const filterContainer = document.getElementById(
    `${filterName}FilterContainer`
  );
  if (isOpen) filterContainer.classList.add("open");
  else filterContainer.classList.remove("open");
}

function createFilterContainer(filterName) {
  const filterContainer = document.createElement("div");
  filterContainer.id = `${filterName}FilterContainer`;
  filterContainer.className = `filterContainer text-light rounded d-flex align-items-center bg-${filterName}`;
  return filterContainer;
}

function createFilterLabel() {
  const label = document.createElement("div");
  label.className =
    "d-flex flex-column justify-content-between container position-relative";
  return label;
}

function toggleFilterInput(filterName, isOpen) {
  const input = document.getElementById(`${filterName}FilterInput`);
  const span = document.getElementById(`${filterName}FilterSpan`);
  if (!isOpen) {
    input.classList.add("hidden");
    span.classList.remove("hidden");
  }
  else {
    input.classList.remove("hidden");
    span.classList.add("hidden");
  }
}

function createFilterDivInput(name) {
    const divInput = document.createElement("div");
    divInput.id = `${name}FilterDivInput`;
  divInput.classList.add(
    "d-flex",
    "justify-content-between",
    "align-items-center",
    "position-relative"
  );
  return divInput;
}

/**
 * It creates an input element, sets its type, id, placeholder, and classList, and adds an oninput
 * event listener that calls the updateDatasFilters function with an object containing the name of the
 * filter and an array of the results of the filterTagSearch function.
 * @param {string} filterName - the name of the filter.
 * @param {string} placeholder - The text that will be displayed in the input field when it's empty.
 * @returns {HTMLInputElement} An input element.
 */
function createFilterInput(filterName, placeholder) {
  const input = document.createElement("input");
  input.type = "text";
  input.id = `${filterName}FilterInput`;
  input.placeholder = placeholder;
  input.classList.add("filterInput","hidden");
  input.oninput = () => {
    updateDatasFilters({
      name: filterName,
      array: filterTagSearch(filterName, input.value),
    });
  }
  return input;
}

function createFilterSpan(filterName, displayName) {
    const span = document.createElement("span");
  span.classList.add("filterSpan");
  span.id = `${filterName}FilterSpan`;
  span.innerText = displayName;
  return span;
}

function toggleFilterIcon(filterName, isOpen) {
    const i = document.getElementById(`${filterName}-filter-icon`);
  if(isOpen) {
    i.classList.replace("fa-chevron-down","fa-chevron-up");
    i.onclick = () => closeFilter();
  }
  else {
    i.classList.replace("fa-chevron-up","fa-chevron-down");
    i.onclick = () => openSelectFilter(filterName);
  }
}

function createFilterIcon(filterName) {
    const i = document.createElement("i");
  i.className = "fas filterChevron";
  i.id = `${filterName}FilterIcon`;
    i.classList.add("fa-chevron-down");
    i.onclick = () => openSelectFilter(filterName);
  i.id = `${filterName}-filter-icon`;
  return i;
}

function openSelectFilter(filterName) {
  activeFilter = filterName;
  const { ustensils, appliances, ingredients } = getTagsToDisplay();
  updateFilters(
    { name: "ustensils", array: ustensils },
    { name: "appliances", array: appliances },
    { name: "ingredients", array: ingredients }
  );
}

function closeFilter() {
  activeFilter = "";
  const { ustensils, appliances, ingredients } = getTagsToDisplay();
  updateFilters(
    { name: "ustensils", array: ustensils },
    { name: "appliances", array: appliances },
    { name: "ingredients", array: ingredients }
  );
}

function createFilterListContainer(filterName) {
    const filterListContainer = document.createElement("div");
    filterListContainer.id = `${filterName}FilterListContainer`;
  filterListContainer.className =
    "px-3 ms-0 overflow-hidden position-absolute top-100 hidden";
  filterListContainer.classList.add(`bg-${filterName}`);
  filterListContainer.style.left = "0";
  filterListContainer.style.width = "inherit";
  return filterListContainer;
}

function toggleFilterListContainer(name, isOpen) {
  const filterListContainer = document.getElementById(
    `${name}FilterListContainer`
  );
  if(isOpen) filterListContainer.classList.toggle("hidden");
  else filterListContainer.classList.add("hidden");

}

function createFilterUl(filterName) {
    const ul = document.createElement("ul");
  ul.classList.add(
    `${filterName}FilterList`,
    "list-unstyled",
    "d-flex",
    "flex-wrap",
    "mt-2"
  );
  ul.name = filterName;
  ul.id = `${filterName}FilterList`;
  return ul;
}

/**
 * Create a list item, add a class, add the text, and add an onclick event to add a tag.
 * @param {string} item - the item that is being added to the list
 * @param {string} filterName - the name of the filter
 * @returns {HTMLLIElement} A li element.
 */
function createFilterLi(item, filterName) {
      const li = document.createElement("li");
    li.classList.add("filterListItem");
    li.innerText = item;
    li.onclick = () => addTag(item.toLowerCase(), filterName);
    return li;
}

/**
 * It displays all the active tags in the filterTagContainer for the 3 filters.
 * @param {{ingredients:string[], appliances:string[], ustensils:string[]}} arrays - an object containing the arrays of the 3 filters.
 */
function displaysActiveTags(arrays) {
  const activeTagsContainer = document.getElementById("filterTagContainer");
  activeTagsContainer.innerHTML = "";
  const { ustensils, appliances, ingredients } = arrays;
  ingredients.forEach((ingredient) => {
    const filterTag = createFilterTag("ingredients", ingredient);
    activeTagsContainer.appendChild(filterTag);
  });
  appliances.forEach((appliance) => {
    const filterTag = createFilterTag("appliances", appliance);
    activeTagsContainer.appendChild(filterTag);
  });
  ustensils.forEach((ustensil) => {
    const filterTag = createFilterTag("ustensils", ustensil);
    activeTagsContainer.appendChild(filterTag);
  });
}

/**
 * It creates an active tag 
 * @param {string} type - the type of filter
 * @param {string} name - the name of the tag
 * @returns {HTMLSpanElement} A span element with two children, a span and a span.
 */
function createFilterTag(type, name) {
  const filterTag = document.createElement("span");
  filterTag.classList.add("filterTag", "btn", "text-light", "bg-"+type);
  const innerSpan = document.createElement("span");
  innerSpan.classList.add("lh-1");
  innerSpan.innerText = name;
  const icon = document.createElement("span");
  icon.classList.add("far", "fa-times-circle", "align-middle", "filterTagIcon", "lh-1");
  icon.onclick = () => removeTag(name, type);
  filterTag.appendChild(innerSpan);
  filterTag.appendChild(icon);
  return filterTag;
}

export {
  createFilters,
  createSingleFilter,
  updateFilters,
  updateDatasFilters,
  displaysActiveTags,
};