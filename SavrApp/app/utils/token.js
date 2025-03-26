import AsyncStorage from '@react-native-async-storage/async-storage';

const storeToken = async (token) => {
    try {
        await AsyncStorage.setItem('userToken', token);
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du token :", error);
    }
};

const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        return token;
    } catch (error) {
        console.error("Erreur lors de la récupération du token :", error);
        return null;
    }
};

const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('userToken');
    } catch (error) {
        console.error("Erreur lors de la suppression du token :", error);
    }
};

export default { storeToken, getToken, removeToken };
  