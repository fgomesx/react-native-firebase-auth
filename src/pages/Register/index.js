import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { auth } from "../../services/firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Spinner from 'react-native-loading-spinner-overlay';
import { updateProfile } from 'firebase/auth';

const schema = yup.object({ // Define as condições para cadastro de usuário
    email: yup.string().email("Informe um e-mail válido").required("Informe seu e-mail"),
    password: yup.string().min(6, "A senha deve conter pelo menos 6 dígitos").required("Informe uma senha"),
    passwordRe: yup.string().oneOf([yup.ref('password'), null], 'As senhas devem ser iguais').required("Confirme sua senha")
})

export default function Register() {

    // Controle dos formulários caso não cumpra as regra definidas em "schema"
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    // Animação de loading
    const [loading, setLoading] = useState(false);  

    // Navegação entre telas quando chamadas
    const navigation = useNavigation(); 

    function handleCreate(data){
        // Alerta quando as senhas divergirem no ato do cadastro
        if (data.password !== data.passwordRe){ 
            console.log("As senhas não coincidem");
            return;
        }

        setLoading(true);

        const { email, password } = data;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                return updateProfile(user, {
                displayName: data.user // 'data.user' é o nome capturado do formulário
                });
            })
            .then(() => {   // Se cumprir os requitos, cadastra
                setLoading(false);
                console.log("Usuário", data.email, "criado com sucesso!")
                alert("Cadastro realizado com sucesso!");
                navigation.navigate('SingIn'); // Redirecionar para a tela de login após a criação do usuário
            })
            .catch((error) => { // Se não cumprir, não cadastra
                setLoading(false);
                console.error("Erro ao criar usuário:", error.message);
                alert("Erro ao criar usuário. Verifique se o e-mail já está cadastrado.");
            });
    }

    return (
        <View style={styles.container}>

            <SafeAreaView style={styles.containerTextLogo}>
                <Animatable.Image 
                animation='fadeInLeft'
                delay={100}
                source={require('../../assets/logo-logomark.png')}
                style={{ width: '20%', height: '60%'}}
                resizeMode="contain"
                />
                
                <Animatable.View animation='fadeInLeft' delay={100} style={styles.containerHeader}>
                    <Text style={styles.message}>Cadastro</Text>
                </Animatable.View>

            </SafeAreaView>

            <Animatable.View animation='fadeInUp' delay={300} style={styles.containerForm}>

                <Text style={styles.title}>E-mail *</Text>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: {onChange, onBlur, value} }) => (
                        <TextInput 
                            style={styles.input}
                            placeholder="Digite um e-mail válido"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            autoCorrect={false}
                        />
                    )} 
                />
                {/* Erro quando não cumprido as regras definidas em "schema" para cadastro de usuário */}
                {errors.email && <Text style={styles.labelError}>{errors.email?.message}</Text>}

                <Text style={styles.title}>Senha *</Text>
                <Controller
                    control={control}
                    name="password"
                    render={({ field: {onChange, onBlur, value} }) => (
                        <TextInput 
                            style={styles.input}
                            placeholder="Digite uma senha"
                            autoCapitalize="none"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            autoCorrect={false}
                            secureTextEntry={true}
                        />
                     )} 
                />
                {/* Erro quando não cumprido as regras definidas em "schema" para cadastro de usuário */}
                {errors.password && <Text style={styles.labelError}>{errors.password?.message}</Text>}

                <Text style={styles.title}>Confirmar senha *</Text>
                <Controller
                    control={control}
                    name="passwordRe"
                    render={({ field: {onChange, onBlur, value} }) => (
                        <TextInput 
                            style={styles.input}
                            placeholder="Confirme sua senha"
                            autoCapitalize="none"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            autoCorrect={false}
                            secureTextEntry={true}
                        />
                    )} 
                />
                {/* Erro quando não cumprido as regras definidas em "schema" para cadastro de usuário */}
                {errors.passwordRe && <Text style={styles.labelError}>{errors.passwordRe?.message}</Text>}

                <TouchableOpacity style={styles.button} onPress={handleSubmit(handleCreate)}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonRegister} onPress={ () => navigation.navigate('SingIn')}>
                    <Text style={styles.registerText}>Voltar</Text>
                </TouchableOpacity>
                    
                <Spinner visible={loading} textContent={'Cadastrando...'} textStyle={styles.loadingText} />

            </Animatable.View>

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#E5EAF0'
    },
    containerTextLogo:{
        marginTop: '1%',
        paddingStart: '3%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    containerHeader:{
        marginTop: '1%',
        textAlignVertical: 'center'
    },
    message:{
        fontSize: 20,
        color: '#000000',
        fontWeight: 'bold'
    },
    containerForm:{
        backgroundColor: '#FFFFFF',
        flex: 8,
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    title:{
        fontSize: 18,
        marginTop: 10,
        marginLeft: 5,
    },
    input:{
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        height: 40,
        marginBottom: 5,
        fontSize:16
    },
    button:{
        backgroundColor: '#1A73E8',
        width: '100%',
        borderRadius: 10,
        paddingVertical: 8,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText:{
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonRegister:{
        marginTop: 20,
        alignSelf: 'center',
    },
    registerText:{
        color: '#808080',
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