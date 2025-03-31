
import { API_URI } from '../constants/config';

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URI}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  const data = await response.json();
  return { response, data };
};

export const logoutUser = async (token) => {
  const response = await fetch(`${API_URI}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return { response, data };
}

export const registerUser = async (email, password, firstName, lastName) => {
  const response = await fetch(`${API_URI}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "email": email.trim(), "firstName": firstName.trim(), "lastName": lastName.trim(), "password": password }),
  });
  const data = await response.json();

  return { response, data };
};

export const checkUserExists = async (email) => {
  const response = await fetch(`${API_URI}/auth/exists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });

  const data = await response.json();
  return { response, data };
}