import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { router } from "expo-router";
import { auth, db } from "../firebaseConfig";
import { cores } from "../theme";

type Lancamento = {
  id: string;
  tipo: "receita" | "despesa";
  observacao: string;
  valor: number;
  data: string;
};

const dinheiro = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Inicio() {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);

  useEffect(() => {
    const cancelarAuth = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
      if (!user) router.replace("/login");
    });
    return cancelarAuth;
  }, []);

  useEffect(() => {
    if (!usuario) return;
    const q = query(collection(db, "usuarios", usuario.uid, "lancamentos"), orderBy("data", "desc"));
    const cancelar = onSnapshot(q, (snapshot) => {
      setLancamentos(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Lancamento)));
    }, (erro) => Alert.alert("Erro", erro.message));
    return cancelar;
  }, [usuario]);

  if (carregando || !usuario) {
    return <View style={styles.centro}><ActivityIndicator size="large" color={cores.azul} /></View>;
  }

  const receitas = lancamentos.filter((item) => item.tipo === "receita").reduce((soma, item) => soma + item.valor, 0);
  const despesas = lancamentos.filter((item) => item.tipo === "despesa").reduce((soma, item) => soma + item.valor, 0);
  const saldo = receitas - despesas;

  async function sair() {
    await signOut(auth);
    router.replace("/login");
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <View style={styles.topo}>
        <View>
          <Text style={styles.pequeno}>MEU FINANCEIRO</Text>
          <Text style={styles.titulo}>Olá!</Text>
          <Text style={styles.subtitulo}>{usuario.email}</Text>
        </View>
        <Pressable onPress={sair} style={styles.botaoSair}><Text style={styles.botaoSairTexto}>Sair</Text></Pressable>
      </View>

      <View style={styles.saldoCard}>
        <Text style={styles.label}>Saldo atual</Text>
        <Text style={styles.saldo}>{dinheiro(saldo)}</Text>
        <Text style={styles.saldoInfo}>Seu resumo financeiro</Text>
      </View>

      <View style={styles.resumos}>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoLabel}>↑ Recebido</Text>
          <Text style={[styles.resumoValor, { color: cores.verde }]}>{dinheiro(receitas)}</Text>
        </View>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoLabel}>↓ Pago</Text>
          <Text style={[styles.resumoValor, { color: cores.vermelho }]}>{dinheiro(despesas)}</Text>
        </View>
      </View>

      <Text style={styles.secao}>Movimentações recentes</Text>
      {lancamentos.length === 0 ? (
        <View style={styles.vazio}><Text style={styles.vazioTexto}>Nenhum lançamento ainda.</Text><Text style={styles.subtitulo}>Adicione uma receita ou despesa para começar.</Text></View>
      ) : lancamentos.slice(0, 5).map((item) => (
        <View key={item.id} style={styles.linha}>
          <View style={styles.linhaIcone}><Text style={{ color: item.tipo === "receita" ? cores.verde : cores.vermelho }}>{item.tipo === "receita" ? "+" : "−"}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.linhaTitulo}>{item.observacao}</Text>
            <Text style={styles.linhaData}>{new Date(`${item.data}T12:00:00`).toLocaleDateString("pt-BR")}</Text>
          </View>
          <Text style={[styles.linhaValor, { color: item.tipo === "receita" ? cores.verde : cores.vermelho }]}>{item.tipo === "receita" ? "+" : "−"} {dinheiro(item.valor)}</Text>
        </View>
      ))}

      <View style={styles.acoes}>
        <Pressable style={styles.botaoPrincipal} onPress={() => router.push("/lancamento?tipo=receita")}><Text style={styles.botaoTexto}>+ Receber</Text></Pressable>
        <Pressable style={styles.botaoDespesa} onPress={() => router.push("/lancamento?tipo=despesa")}><Text style={styles.botaoTexto}>− Pagar</Text></Pressable>
      </View>
      <Pressable style={styles.botaoExtrato} onPress={() => router.push("/extrato")}><Text style={styles.botaoExtratoTexto}>Ver extrato completo →</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: cores.fundo },
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 22, paddingBottom: 40 },
  topo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  pequeno: { color: cores.azulClaro, fontSize: 11, fontWeight: "bold", letterSpacing: 2 },
  titulo: { color: cores.texto, fontSize: 30, fontWeight: "bold", marginTop: 5 },
  subtitulo: { color: cores.textoSecundario, fontSize: 12, marginTop: 4 },
  botaoSair: { borderWidth: 1, borderColor: cores.borda, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  botaoSairTexto: { color: cores.texto },
  saldoCard: { backgroundColor: cores.azul, borderRadius: 22, padding: 23, marginBottom: 15 },
  label: { color: "#E0E9FF", fontSize: 14 },
  saldo: { color: "#FFFFFF", fontSize: 32, fontWeight: "bold", marginTop: 12 },
  saldoInfo: { color: "#D7E4FF", fontSize: 12, marginTop: 8 },
  resumos: { flexDirection: "row", gap: 12, marginBottom: 27 },
  resumoCard: { flex: 1, backgroundColor: cores.cartao, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: cores.borda },
  resumoLabel: { color: cores.textoSecundario, fontSize: 12 },
  resumoValor: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  secao: { color: cores.texto, fontSize: 18, fontWeight: "bold", marginBottom: 13 },
  vazio: { padding: 20, backgroundColor: cores.cartao, borderRadius: 15 },
  vazioTexto: { color: cores.texto, fontWeight: "bold", marginBottom: 5 },
  linha: { flexDirection: "row", alignItems: "center", backgroundColor: cores.cartao, borderRadius: 15, padding: 13, marginBottom: 9, gap: 11 },
  linhaIcone: { width: 34, height: 34, borderRadius: 12, backgroundColor: cores.cartaoClaro, alignItems: "center", justifyContent: "center" },
  linhaTitulo: { color: cores.texto, fontWeight: "600", fontSize: 13 },
  linhaData: { color: cores.textoSecundario, fontSize: 11, marginTop: 4 },
  linhaValor: { fontWeight: "bold", fontSize: 12 },
  acoes: { flexDirection: "row", gap: 12, marginTop: 22 },
  botaoPrincipal: { flex: 1, backgroundColor: cores.verde, padding: 16, borderRadius: 14, alignItems: "center" },
  botaoDespesa: { flex: 1, backgroundColor: cores.vermelho, padding: 16, borderRadius: 14, alignItems: "center" },
  botaoTexto: { color: "#FFFFFF", fontWeight: "bold" },
  botaoExtrato: { padding: 17, alignItems: "center", marginTop: 8 },
  botaoExtratoTexto: { color: cores.azulClaro, fontWeight: "bold" }
});
