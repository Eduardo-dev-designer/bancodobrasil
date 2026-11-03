import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";
import { auth } from "../firebaseConfig";
import { cores } from "../theme";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    if (!email.trim() || !senha || !confirmar) return Alert.alert("Atenção", "Preencha todos os campos.");
    if (senha.length < 6) return Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres.");
    if (senha !== confirmar) return Alert.alert("Atenção", "As senhas não são iguais.");
    try {
      setCarregando(true);
      await createUserWithEmailAndPassword(auth, email.trim(), senha);
      Alert.alert("Sucesso", "Sua conta foi criada!");
      router.replace("/");
    } catch (erro: any) {
      Alert.alert("Erro ao cadastrar", erro.message);
    } finally { setCarregando(false); }
  }

  return (
    <View style={styles.tela}>
      <Text style={styles.titulo}>Crie sua conta</Text>
      <Text style={styles.subtitulo}>Seus dados financeiros ficam associados ao seu usuário.</Text>
      <Text style={styles.label}>E-mail</Text>
      <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor={cores.cinza} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Text style={styles.label}>Senha</Text>
      <TextInput style={styles.input} placeholder="Mínimo de 6 caracteres" placeholderTextColor={cores.cinza} secureTextEntry value={senha} onChangeText={setSenha} />
      <Text style={styles.label}>Confirmar senha</Text>
      <TextInput style={styles.input} placeholder="Digite a senha novamente" placeholderTextColor={cores.cinza} secureTextEntry value={confirmar} onChangeText={setConfirmar} />
      <Pressable style={styles.botao} onPress={cadastrar} disabled={carregando}>{carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Criar conta</Text>}</Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, padding: 25, justifyContent: "center" },
  titulo: { color: cores.texto, fontSize: 27, fontWeight: "bold" },
  subtitulo: { color: cores.textoSecundario, marginTop: 8, marginBottom: 25 },
  label: { color: cores.texto, fontWeight: "600", marginBottom: 8, marginTop: 13 },
  input: { backgroundColor: cores.cartao, color: cores.texto, borderWidth: 1, borderColor: cores.borda, borderRadius: 13, padding: 16 },
  botao: { backgroundColor: cores.azul, padding: 17, borderRadius: 13, alignItems: "center", marginTop: 28 },
  botaoTexto: { color: "#fff", fontWeight: "bold" }
});
