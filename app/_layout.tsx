import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { cores } from "../theme";

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{
        headerStyle: { backgroundColor: cores.fundo },
        headerTintColor: cores.texto,
        headerTitleStyle: { fontWeight: "bold" },
        contentStyle: { backgroundColor: cores.fundo },
        headerShadowVisible: false
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Entrar" }} />
        <Stack.Screen name="cadastro" options={{ title: "Criar conta" }} />
        <Stack.Screen name="lancamento" options={{ title: "Novo lançamento" }} />
        <Stack.Screen name="extrato" options={{ title: "Extrato" }} />
      </Stack>
    </>
  );
}
