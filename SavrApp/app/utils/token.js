import AsyncStorage from '@react-native-async-storage/async-storage';

const storeToken = async (token) => {
    try {
        await AsyncStorage.setItem('userToken', token);
    } catch (error) {
        console.error("Error during token storage:", error);
    }
};

const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        return token;
    } catch (error) {
        console.error("Error during token retrieval:", error);
        return null;
    }
};

const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('userToken');
    } catch (error) {
        console.error("Error during token removal:", error);
    }
};

export default { storeToken, getToken, removeToken };
  