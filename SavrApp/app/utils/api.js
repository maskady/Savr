import { request } from './request';

export const getShops = async (latitude, longitude, radius) => {
  try {
    const response = await request('/shop', 'GET', null, { latitude, longitude, radius });
    data = response.data.data; // .data.data is not a mistake - api is defined this way
    if (!data) {
      data = [];
    }
    return data; 
  } catch (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const response = await request(`/product`, 'GET');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await request(`/category`, 'GET');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

// Get shop by id
export const getShopById = async (id) => {
  try {
    const response = await request(`/shop/${id}`, 'GET');
    return response.data;
  } catch (error) {
    console.log("error------", error);
    console.error('Error fetching shop by id:', error);
    throw error;
  }
}

// Update shop details
export const updateShop = async (id, data) => {
  try {
    console.log("data", data);
    const response = await request(`/shop/${id}`, 'PUT', data);
    console.log("response", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error updating shop:', error);
    throw error;
  }
}

export const loadUserData = async () => {
  try {
    const response = await request("/user/me", 'GET');
    const data = response.data.data;
    console.log("[utils/api/loadUserData] Data:", data);
    return data;
  } catch (error) {
    console.error("[utils/api/loadUserData] Error fetching user data:", error);
    navigation.navigate("App", { screen: "Error", params: { error: error.message } });
    return null;
  }

};

export const saveUserData = async ({ firstName, lastName, email}) => {
  try {
    const response = await request("/user/me/profile", 'PUT', { firstName, lastName, email}, null);
    console.log("[utils/api/saveUserData] Response:", response);
    return response;
  }
  catch (error) {
    console.error("[utils/api/saveUserData] Error saving user data:", error);
    navigation.navigate("App", { screen: "Error", params: { error: error.message } });
    return null;
  }
}
