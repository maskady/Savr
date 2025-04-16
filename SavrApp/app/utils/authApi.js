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


