import initPage from "./pages/index.js";
import { setDataManagerSource } from "./dataManager.js";

setDataManagerSource("http://localhost:5500/datas/recipes.json");
initPage();