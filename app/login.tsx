import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, router } from "expo-router";
import { auth } from "../firebaseConfig";
import { cores } from "../theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!email.trim() || !senha) return Alert.alert("Atenção", "Informe seu e-mail e sua senha.");
    try {
      setCarregando(true);
      await signInWithEmailAndPassword(auth, email.trim(), senha);
      router.replace("/");
    } catch (erro: any) {
      Alert.alert("Não foi possível entrar", erro.message);
    } finally { setCarregando(false); }
  }

  return (
    <View style={styles.tela}>
      <Text style={styles.logo}>MEU<Text style={{ color: cores.azulClaro }}>FINANCEIRO</Text></Text>
      <Text style={styles.titulo}>Bem-vindo de volta</Text>
      <Text style={styles.subtitulo}>Entre para acompanhar seu dinheiro.</Text>
      <Text style={styles.label}>E-mail</Text>
      <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor={cores.cinza} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Text style={styles.label}>Senha</Text>
      <TextInput style={styles.input} placeholder="Sua senha" placeholderTextColor={cores.cinza} secureTextEntry value={senha} onChangeText={setSenha} />
      <Pressable style={styles.botao} onPress={entrar} disabled={carregando}>{carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Entrar</Text>}</Pressable>
      <Link href="/cadastro" style={styles.link}>Ainda não tem conta? Criar cadastro</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, padding: 25, justifyContent: "center" },
  logo: { color: cores.texto, fontSize: 16, fontWeight: "900", letterSpacing: 2, marginBottom: 45 },
  titulo: { color: cores.texto, fontSize: 27, fontWeight: "bold" },
  subtitulo: { color: cores.textoSecundario, marginTop: 8, marginBottom: 30 },
  label: { color: cores.texto, fontWeight: "600", marginBottom: 8, marginTop: 13 },
  input: { backgroundColor: cores.cartao, color: cores.texto, borderWidth: 1, borderColor: cores.borda, borderRadius: 13, padding: 16 },
  botao: { backgroundColor: cores.azul, padding: 17, borderRadius: 13, alignItems: "center", marginTop: 25 },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  link: { color: cores.azulClaro, textAlign: "center", marginTop: 24 }
});
