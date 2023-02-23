import initPage from "./pages/index.js";
import { setDataManagerSource } from "./dataManager.js";

setDataManagerSource("/datas/recipes.json");
initPage();