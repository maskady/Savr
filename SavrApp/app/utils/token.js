import AsyncStorage from '@react-native-async-storage/async-storage';
import request from './request';

const storeToken = async (token) => {
  try {
      await AsyncStorage.setItem('userToken', token);
  } catch (error) {
      console.error("Error during token storage:", error);
  }
};

export const getToken = async () => {
  try {
      const token = await AsyncStorage.getItem('userToken');
      return token;
  } catch (error) {
      console.error("Error during token retrieval:", error);
      return null;
  }
};

export const removeToken = async () => {
  try {
      await AsyncStorage.removeItem('userToken');
  } catch (error) {
      console.error("Error during token removal:", error);
  }
};
  
export const refreshToken = async (token) => {
  try {
    const response = await request('/auth/refresh-token', 'POST', { token });
    return response;
  } catch (error) {
    console.error("Error in refreshToken:", error);
    throw error; // Rethrow so the caller can handle it
  }
};

export default storeToken;