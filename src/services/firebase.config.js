import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
// Cole aqui as credenciais do app do projeto criado no Firebase.
    // apiKey: "Sua_apiKey",
    // authDomain: "Sua_authDomain",
    // databaseURL: "Sua_databaseURL",
    // projectId: "Sua_projectId",
    // storageBucket: "Sua_storageBucket",
    // messagingSenderId: "Sua_messagingSenderId",
    // appId: "Sua_appId",
    // measurementId: "Sua_measurementId"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { app, auth }; // Exporte app e auth para uso em outros arquivos