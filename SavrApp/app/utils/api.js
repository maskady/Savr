import { request } from './request';

export const getShops = async (latitude, longitude, radius) => {
  try {
    const response = await request('/shop', 'GET', null, null, { latitude, longitude, radius });
    return response.data.data; // .data.data is not a mistake - api is defined this way
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

