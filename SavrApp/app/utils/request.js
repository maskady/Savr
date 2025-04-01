import { API_URI } from '@env';
import { getToken } from './token';

export const request = async (endpoint, method, body) => {
  const headers = { "Content-Type": "application/json" };

  let token = await getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  console.log("request--------", `${API_URI}${endpoint}`);
  const response = await fetch(`${API_URI}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await response.json();
  return { response, data };
};
