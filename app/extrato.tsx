import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { cores } from "../theme";

type Lancamento = { id: string; tipo: "receita" | "despesa"; observacao: string; valor: number; data: string };
const dinheiro = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Extrato() {
  const [itens, setItens] = useState<Lancamento[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const usuario = auth.currentUser;
    if (!usuario) { setCarregando(false); return; }
    const q = query(collection(db, "usuarios", usuario.uid, "lancamentos"), orderBy("data", "desc"));
    const cancelar = onSnapshot(q, (snapshot) => {
      setItens(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Lancamento)));
      setCarregando(false);
    }, (erro) => { Alert.alert("Erro ao carregar extrato", erro.message); setCarregando(false); });
    return cancelar;
  }, []);

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>Extrato completo</Text>
      <Text style={styles.subtitulo}>Movimentações organizadas por data, da mais recente para a mais antiga.</Text>
      {carregando ? <ActivityIndicator color={cores.azul} size="large" /> : itens.length === 0 ? (
        <View style={styles.vazio}><Text style={styles.vazioTexto}>Nenhuma movimentação cadastrada.</Text></View>
      ) : itens.map((item) => (
        <View key={item.id} style={styles.linha}>
          <View style={{ flex: 1 }}>
            <Text style={styles.descricao}>{item.observacao}</Text>
            <Text style={styles.data}>{new Date(`${item.data}T12:00:00`).toLocaleDateString("pt-BR")}</Text>
            <Text style={styles.tipo}>{item.tipo === "receita" ? "Recebimento" : "Pagamento"}</Text>
          </View>
          <Text style={[styles.valor, { color: item.tipo === "receita" ? cores.verde : cores.vermelho }]}>{item.tipo === "receita" ? "+" : "−"} {dinheiro(item.valor)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 22, paddingBottom: 40 },
  titulo: { color: cores.texto, fontSize: 25, fontWeight: "bold" },
  subtitulo: { color: cores.textoSecundario, marginTop: 7, marginBottom: 22, lineHeight: 19 },
  vazio: { backgroundColor: cores.cartao, padding: 20, borderRadius: 15 },
  vazioTexto: { color: cores.texto },
  linha: { flexDirection: "row", alignItems: "center", backgroundColor: cores.cartao, padding: 16, borderRadius: 15, marginBottom: 10, gap: 10 },
  descricao: { color: cores.texto, fontWeight: "bold", fontSize: 14 },
  data: { color: cores.textoSecundario, fontSize: 12, marginTop: 5 },
  tipo: { color: cores.azulClaro, fontSize: 10, marginTop: 5 },
  valor: { fontWeight: "bold", fontSize: 13 }
});
