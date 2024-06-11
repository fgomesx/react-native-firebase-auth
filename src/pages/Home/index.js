import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable'
import { useNavigation } from "@react-navigation/native";
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const FeedScreen = () => {
    const navigation = useNavigation(); // Naveção entre as telas chamadas
    const [userData, setUserData] = useState(null); // Verificar se o usuário está autenticado

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Usuário está autenticado, você pode acessar seus dados aqui
                const { email } = user;
                setUserData({ email });
            } else {
                // Usuário não está autenticado
                setUserData(null);
            }
        });

        return () => unsubscribe(); // Limpa o evento de autenticação ao desmontar o componente
    }, []);

    const handleLogout = async () => {  // Função para logout
        const auth = getAuth();
        try {
            await signOut(auth);
            navigation.navigate('SingIn'); // Navega de volta para a tela de SignIn após logout
            console.log("Usuário", userData.email ,"se desconectou!");
            alert("Você se desconectou!");
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Animatable.View animation='fadeInDown' style={styles.title}>
                <Text style={styles.message}>Bem-vindo(a)</Text>
            </Animatable.View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
            
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5EAF0',
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        marginTop: '10%'
    },
    message: {
        fontSize: 20
    },
    logoutButton: {
        backgroundColor: '#DC143C',
        width: '20%',
        borderRadius: 20,
        paddingVertical: 8,
        marginTop: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default FeedScreen;