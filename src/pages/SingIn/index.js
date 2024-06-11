import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import * as Animatable from 'react-native-animatable'
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { auth } from "../../services/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import Spinner from 'react-native-loading-spinner-overlay';

const schema = yup.object({ //define as regras válidas para o login
    email: yup.string().email("E-mail inválido").required("Informe seu e-mail"),
    password: yup.string().min(6, "Senha inválida").required("Informe sua senha")
})

export default function SingIn() {

    // Controle dos formulários caso não cumpra as regra definidas em "schema"
    const { control, handleSubmit, formState: { errors } } = useForm({ 
        resolver: yupResolver(schema)
    })

    const [loading, setLoading] = useState(false);  // Animação loading
    const navigation = useNavigation(); // Navegação entre as telas quando chamadas

    function handleLogin(data){ // Função para login

        setLoading(true);   // Iniciar animação de loading (true)

        const { email, password } = data;

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {   // Se usuário existir, passa 
                setLoading(false);  // Parar animação de loading se passar
                console.log("Login do usuário", data.email, "bem-sucedido!");
                navigation.navigate('Home'); // Redirecionar para a tela Home após o login
            })
            .catch((error) => { // Se não existir, não passa
                setLoading(false);  // Parar animação de loading se não passar
                console.error("Erro ao fazer login:", error.message);
                alert("Usuário ou senha incorretos. Por favor, tente novamente.");
            });
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.containerLogo}>
                <Animatable.Image 
                animation='fadeIn'
                delay={100}
                source={require('../../assets/logo-logomark.png')}
                style={{ width: '20%', height: '100%'}}
                resizeMode="contain"
                />
            </SafeAreaView>
            <Animatable.View animation='fadeIn' delay={100} style={styles.containerHeader}>
                <Text style={styles.message}>Autenticação com Firebase</Text>
            </Animatable.View>

            <Animatable.View animation='fadeInUp' delay={500} style={styles.containerForm}>
                
                <Text style={styles.title}>E-mail</Text>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: {onChange, onBlur, value} }) => (
                        <TextInput 
                            style={styles.input}
                            placeholder="Digite seu e-mail"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            autoCorrect={false}
                        />
                    )} 
                />
                {/* Erro quando não cumprido as regras definidas em "schema" para login do usuário */}
                {errors.email && <Text style={styles.labelError}>{errors.email?.message}</Text>}

                <Text style={styles.title}>Senha</Text>
                <Controller
                    control={control}
                    name="password"
                    render={({ field: {onChange, onBlur, value} }) => (
                        <TextInput 
                            style={styles.input}
                            placeholder="Digite sua senha"
                            autoCapitalize="none"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            autoCorrect={false}
                            secureTextEntry={true}
                        />
                    )} 
                />
                {/* Erro quando não cumprido as regras definidas em "schema" para login do usuário */}
                {errors.password && <Text style={styles.labelError}>{errors.password?.message}</Text>}

                <TouchableOpacity style={styles.button} onPress={handleSubmit(handleLogin)}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
                    
                <Text style={styles.titleRegisterText}>Não possui cadastro?</Text>
                <TouchableOpacity style={styles.buttonRegister} onPress={ () => navigation.navigate('Register')}>
                    <Text style={styles.registerText}>Cadastre-se</Text>
                </TouchableOpacity>

                <Spinner visible={loading} textContent={'Entrando...'} textStyle={styles.loadingText} />
                
            </Animatable.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#E5EAF0'
    },
    containerLogo:{
        flex: 1,
        marginTop: '5%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerHeader:{
        marginTop: '5%',
        marginBottom: '8%',
        alignItems: 'center'
    },
    message:{
        fontSize: 25,
        fontWeight: 'bold',
        color: '#000000'
    },
    containerForm:{
        backgroundColor: '#FFFFFF',
        flex: 5,
        paddingStart: '5%',
        paddingEnd: '5%'
    },
    title:{
        fontSize: 20,
        marginTop: 20,
        marginLeft: 5,
    },
    input:{
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        height: 40,
        fontSize:16
    },
    button:{
        backgroundColor: '#1A73E8',
        width: '100%',
        borderRadius: 10,
        paddingVertical: 8,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText:{
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonRegister:{
        marginTop: 5,
        alignSelf: 'center'
    },
    titleRegisterText:{
        color: '#a1a1a1',
        marginTop: 30,
        alignSelf: 'center',
    },
    registerText:{
        color: '#1A73E8',
        fontSize: 16,
        fontWeight: 'bold'
    },
    labelError:{
        alignSelf: 'flex-start',
        color: '#FF0000',
        marginLeft: 10
    },
    loadingText: {
        color: '#FFFFFF',
    },
})