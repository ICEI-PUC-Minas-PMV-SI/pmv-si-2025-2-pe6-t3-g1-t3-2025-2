import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import api from "../api";
import { createMMKV } from 'react-native-mmkv';
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

const storage = createMMKV();

export default function Login() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function handleLogin() {
        if (!email || !senha) {
            Toast.show({
                type: "error",
                text1: "Erro ao fazer login",
                text2: "Email e senha são obrigatórios",
            });
            return;
        }

        if (!email.trim().includes("@")) {
            Toast.show({
                type: "error",
                text1: "Erro ao fazer login",
                text2: "Email inválido",
            });
            return;
        }

        if (senha.trim().length < 6) {
            Toast.show({
                type: "error",
                text1: "Erro ao fazer login",
                text2: "Senha deve ter ao menos 6 caracteres",
            });
            return;
        }

        try {
            await api.auth.login(storage, {
                email,
                password: senha
            })

            Toast.show({
                type: "success",
                text1: "Login bem-sucedido",
                text2: `Bem-vindo, ${api.getUserInfo()?.user.unique_name}!`,
            });

            navigation.navigate("Home" as never);
        }
        catch (error) {
            console.error("Erro ao fazer login:", error);

            Toast.show({
                type: "error",
                text1: "Erro ao fazer login",
                text2: "Confira suas credenciais",
            });
        }
    }

    async function checkIfLoggedIn() {
        const isLogged = await api.auth.isLoggedIn(storage);
        return isLogged;
    }

    useEffect(() => {
        checkIfLoggedIn().then((isLogged) => {
            if (isLogged) {
                navigation.navigate("Home" as never);
            }
        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                {/* Header com logo */}
                <View style={styles.header}>
                    <Image
                        source={require("../../assets/images/logoHF.png")} // substitua pelo seu logo
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Título */}
                <Text style={styles.title}>Acessar o sistema</Text>
                <Text style={styles.subtitle}>Hotel Fazenda</Text>

                {/* Inputs */}
                <TextInput
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                />
                <TextInput
                    placeholder="Senha"
                    value={senha}
                    onChangeText={setSenha}
                    style={styles.input}
                    secureTextEntry
                />

                {/* Botão Entrar */}
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>

                {/* Link esqueci senha */}
                <TouchableOpacity>
                    <Text style={styles.forgot}>Esqueci minha senha</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f6f2eb", // fundo da tela
    },
    box: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 24,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    header: {
        backgroundColor: "#3b5a3c", // verde do topo
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 20,
        alignItems: "center",
        marginBottom: 20,
    },
    logo: {
        width: 80,
        height: 80,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#5d4433",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: "#3b5a3c",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
    },
    button: {
        backgroundColor: "#3b5a3c",
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    forgot: {
        color: "#1a73e8",
        textAlign: "center",
        marginTop: 12,
        textDecorationLine: "underline",
    },
});