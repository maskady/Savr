//request.js
import { API_URI } from '@env';
import { getToken } from './token';

const request = async (endpoint, method, body, query={}) => {
  const headers = { "Content-Type": "application/json" };

  let token = await getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  let URL = `${API_URI}${endpoint}`;
  if (query) URL += `?${new URLSearchParams(query)}`;
  
  // console.log("REQUEST", URL, "method", method, "body", body, "TokenIsAvailable", token ? "Yes" : "No", "query", query);
  const response = await fetch(URL, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await response.json();
  return { response, data };
};

export default request;
