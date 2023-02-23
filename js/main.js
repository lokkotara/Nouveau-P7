import initPage from "./pages/index.js";
import { setDataManagerSource } from "./dataManager.js";

setDataManagerSource("https://lokkotara.github.io/P7_13012023/datas/recipes.json");
// setDataManagerSource("http://127.0.0.1:5500/datas/recipes.json");
initPage();