import { getCategories } from "../utils/api";
import { COLORS } from "./colors";

export let businessCategories = [];
export let businessCategoriesColors = {};

(async () => {
  const response = await getCategories();
  businessCategories = response.data;
  // filter out removed and deleted categories
  businessCategories = businessCategories.filter((category) => {
      return !category.dtremoved && !category.dtdeleted;
  });
  // add "other" category
  businessCategories.push({
    id: "other",
    name: "Other",
  });
  console.log("[businessCategories] businessCategories=", businessCategories);

  // Assign random colors to each category (so that the app still works if a new category is added)
  businessCategories.forEach((category, index) => {
    const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
    businessCategoriesColors[category.id] = color;
  });

  // Assign intended colors to caategories
  businessCategories.forEach((category) => {
    if (COLORS.businesses[category.id]) {
      businessCategoriesColors[category.id] = COLORS.businesses[category.id];
    }
  });
  console.log("[businessCategories] businessCategoriesColors=", businessCategoriesColors);
})();

