import { request } from './request';

export const loginUser = (email, password) =>
  request('/auth/login', 'POST', { email: email.trim(), password });

export const logoutUser = (token) =>
  request('/auth/logout', 'POST', null, token);

export const registerUser = (email, password, firstName, lastName) =>
  request('/auth/register', 'POST', {
    email: email.trim(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    password,
  });

export const checkUserExists = (email) =>
  request('/auth/exists', 'POST', { email: email.trim() });

export const getShops = async (latitude, longitude, radius) => {
  try {
    const response = await request('/shop', 'GET', null, { latitude, longitude, radius });
    return response.data.data; // .data.data is not a mistake - api is defined this way
  } catch (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }
};




