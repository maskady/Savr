import { getCategories } from "../utils/api";
import { COLORS } from "./colors";

export let businessCategories = {}; // category id -> category object
export let businessCategoriesColors = {}; // category id -> color

(async () => {
  // Fetch categories array from API and filter out removed/deleted categories.
  const response = await getCategories();
  let categoriesArray = response.data.filter((category) => {
    return !category.dtremoved && !category.dtdeleted;
  });

  // Add "other" category directly into the array.
  categoriesArray.push({
    id: "other",
    name: "Other",
  });

  console.log("[businessCategories] categoriesArray=", categoriesArray);

  // Convert the filtered array into a dictionary keyed by category id.
  businessCategories = {};
  categoriesArray.forEach((category) => {
    businessCategories[category.id] = category;
  });

  // Assign random colors to each category.
  Object.keys(businessCategories).forEach((id) => {
    const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
    businessCategoriesColors[id] = color;
  });

  // Re-assign intended colors to categories if available in COLORS.businesses.
  Object.keys(businessCategories).forEach((id) => {
    if (COLORS.businesses[id]) {
      businessCategoriesColors[id] = COLORS.businesses[id];
    }
  });

  console.log("[businessCategories] businessCategories=", businessCategories);
  console.log("[businessCategories] businessCategoriesColors=", businessCategoriesColors);
})();