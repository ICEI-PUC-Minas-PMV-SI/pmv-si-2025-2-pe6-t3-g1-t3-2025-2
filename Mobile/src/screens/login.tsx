import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";
import Toast from "react-native-toast-message";
import api from "../api";
import { createMMKV  } from 'react-native-mmkv';
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const storage = createMMKV();

export default function Login() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");


    async function doLogin() {
        if(!email || !senha) {
            Toast.show({
                type: "error",
                text1: "Erro ao fazer login",
                text2: "Email e senha são obrigatórios",
            });
            return;
        }

        if(!email.trim().includes("@")) {
            Toast.show({
                type: "error",
                text1: "Erro ao fazer login",
                text2: "Email inválido",
            });
            return;
        }

        if(senha.trim().length < 6) {
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



    return (
        <View style={styles.box}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                placeholder="Email"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Senha"
                secureTextEntry
                style={styles.input}
                value={senha}
                onChangeText={setSenha}
                autoCapitalize="none"
                autoCorrect={false}
            />

            <View style={styles.buttonWrapper}>
                <Button title="Entrar" onPress={doLogin} /> 
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f5f5f5",
  },

  box: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    elevation: 4,         // sombra Android
    shadowColor: "#000",  // sombra iOS
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: "600",
    textAlign: "center",
  },

  input: {
    backgroundColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    fontSize: 16,
  },

  buttonWrapper: {
    marginTop: 10,
  },
});
