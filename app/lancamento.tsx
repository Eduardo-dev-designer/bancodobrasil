import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";
import { auth, db } from "../firebaseConfig";
import { cores } from "../theme";

export default function Lancamento() {
  const params = useLocalSearchParams<{ tipo?: string }>();
  const tipo = params.tipo === "despesa" ? "despesa" : "receita";
  const [valor, setValor] = useState("");
  const [observacao, setObservacao] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    const valorNumerico = Number(valor.replace(",", "."));
    if (!observacao.trim() || !data || !valor.trim()) return Alert.alert("Atenção", "Preencha todos os campos.");
    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) return Alert.alert("Valor inválido", "Informe um valor maior que zero.");
    const usuario = auth.currentUser;
    if (!usuario) return router.replace("/login");
    try {
      setSalvando(true);
      await addDoc(collection(db, "usuarios", usuario.uid, "lancamentos"), {
        tipo, valor: valorNumerico, observacao: observacao.trim(), data, criadoEm: new Date().toISOString()
      });
      Alert.alert("Sucesso", tipo === "receita" ? "Recebimento registrado!" : "Pagamento registrado!");
      router.replace("/");
    } catch (erro: any) {
      Alert.alert("Erro ao salvar", erro.message);
    } finally { setSalvando(false); }
  }

  return (
    <View style={styles.tela}>
      <Text style={styles.titulo}>{tipo === "receita" ? "Novo recebimento" : "Novo pagamento"}</Text>
      <Text style={styles.subtitulo}>Informe os detalhes da movimentação.</Text>
      <Text style={styles.label}>Valor (R$)</Text>
      <TextInput style={styles.input} placeholder="0,00" placeholderTextColor={cores.cinza} keyboardType="decimal-pad" value={valor} onChangeText={setValor} />
      <Text style={styles.label}>Observação</Text>
      <TextInput style={styles.input} placeholder="Ex.: salário, mercado, aluguel..." placeholderTextColor={cores.cinza} value={observacao} onChangeText={setObservacao} />
      <Text style={styles.label}>Data</Text>
      <TextInput style={styles.input} placeholder="AAAA-MM-DD" placeholderTextColor={cores.cinza} value={data} onChangeText={setData} />
      <Text style={styles.dica}>Use o formato de data AAAA-MM-DD.</Text>
      <Pressable style={[styles.botao, { backgroundColor: tipo === "receita" ? cores.verde : cores.vermelho }]} onPress={salvar} disabled={salvando}>{salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Salvar lançamento</Text>}</Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, padding: 22 },
  titulo: { color: cores.texto, fontSize: 25, fontWeight: "bold", marginTop: 12 },
  subtitulo: { color: cores.textoSecundario, marginTop: 7, marginBottom: 20 },
  label: { color: cores.texto, fontWeight: "600", marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: cores.cartao, color: cores.texto, borderWidth: 1, borderColor: cores.borda, borderRadius: 13, padding: 16 },
  dica: { color: cores.textoSecundario, fontSize: 11, marginTop: 7 },
  botao: { padding: 17, borderRadius: 13, alignItems: "center", marginTop: 30 },
  botaoTexto: { color: "#fff", fontWeight: "bold" }
});
