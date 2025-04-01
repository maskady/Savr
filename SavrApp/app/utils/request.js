import { getToken } from './token';

export const request = async (endpoint, method, body) => {
  const headers = { "Content-Type": "application/json" };

  let token = await getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${process.env.API_URI}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await response.json();
  return { response, data };
};
