import { request } from './request';

export const getShops = async (latitude, longitude, radius) => {
  try {
    const response = await request('/shop', 'GET', null, { latitude, longitude, radius });
    const data = response?.data?.data || []; // Safely access response.data.data
    return data;
  } catch (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const response = await request(`/product`, 'GET');
    return response?.data || []; // Safely access response.data
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getShopProducts = async (shopId) => {
  try {
    const response = await request(`/product`, 'GET', null, { shopId });
    console.log("[api] message:", response?.data?.message);
    return response?.data?.data || []; // Safely access response.data
  } catch (error) {
    console.error('[api] Error fetching products:', error);
    throw error;
  }
};

export const getAvailableProductVariantsForShop = async (shopId) => {
  try {
    const response = await request(`/product-variant`, 'GET', null, { shopId });
    console.log("[api] message:", response?.data?.message);
    return response?.data || []; // Safely access response.data
  } catch (error) {
    console.error('[api] Error fetching product variants:', error);
    throw error;
  }
};


export const getCategories = async () => {
  try {
    const response = await request(`/category`, 'GET');
    return response?.data || []; // Safely access response.data
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getShopById = async (id) => {
  try {
    const response = await request(`/shop/${id}`, 'GET');
    return response?.data || null; // Safely access response.data
  } catch (error) {
    console.error('Error fetching shop by id:', error);
    throw error;
  }
};

export const updateShop = async (id, data) => {
  try {
    console.log("data", data);
    const response = await request(`/shop/${id}`, 'PUT', data);
    console.log("response", JSON.stringify(response?.data, null, 2));
    return response?.data || null; // Safely access response.data
  } catch (error) {
    console.error('Error updating shop:', error);
    throw error;
  }
};

export const loadUserData = async () => {
  try {
    const response = await request("/user/me", 'GET');
    const data = response?.data?.data || null; // Safely access response.data.data
    console.log("[utils/api/loadUserData] Data:", data);
    return data;
  } catch (error) {
    console.error("[utils/api/loadUserData] Error fetching user data:", error);
    navigation.navigate("App", { screen: "Error", params: { error: error.message } });
    return null;
  }
};

export const saveUserData = async ({ firstName, lastName, email }) => {
  try {
    const response = await request("/user/me/profile", 'PUT', { firstName, lastName, email }, null);
    console.log("[utils/api/saveUserData] Response:", response);
    return response || null; // Safely return response
  } catch (error) {
    console.error("[utils/api/saveUserData] Error saving user data:", error);
    navigation.navigate("App", { screen: "Error", params: { error: error.message } });
    return null;
  }
};

export const postProduct = async (data) => {
  try {
    const response = await request('/product', 'POST', data);
    console.log("[api] ", response?.data?.message);
    console.log("[api] Product posted successfully. response.data:", response?.data);
    return response?.data || null; // Safely access response.data
  } catch (error) {
    console.error('[api] Error posting product:', error);
    throw error;
  }
};

export const postProductVariant = async (data) => {
  try {
    const response = await request('/product-variant', 'POST', data);
    console.log("[api] ", response?.data?.message);
    console.log("[api] Product Variant posted successfully. response.data:", response?.data);
    if (!response?.data) {
      throw new Error("No data returned from API");
    }
    return response?.data;
  } catch (error) {
    console.error('[api] Error posting product variant:', error);
    throw error;
  }
};

export const updateProduct = async (id, data) => {
  try {
    const response = await request(`/product/${id}`, 'PUT', data);
    console.log("[api] ", response?.data?.message);
    console.log("[api] Product updated successfully. response.data:", response?.data);
    return response?.data || null; // Safely access response.data
  } catch (error) {
    console.error('[api] Error updating product:', error);
    throw error;
  }
};