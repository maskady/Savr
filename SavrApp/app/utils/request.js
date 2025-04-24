import { API_URI } from '@env';
import { getToken } from './token';

const request = async (endpoint, method, body, query={}) => {
  const headers = { "Content-Type": "application/json" };

  let token = await getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  let URL = `${API_URI}${endpoint}`;
  if (query) URL += `?${new URLSearchParams(query)}`;

  const requestId = `req_${Math.random().toString(36).substring(2, 9)}`;

  const startTime = performance.now();
  const response = await fetch(URL, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });


  const data = await response.json();

  // Calculate the duration of the request
  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log("REQUEST", requestId, URL, "method", method, "body", body, "TokenIsAvailable", token ? "Yes" : "No", "query", query, "duration", duration.toFixed(2));

  return { response, data };
};

export default request;
