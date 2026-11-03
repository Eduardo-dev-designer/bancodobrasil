# Meu Financeiro

Aplicativo de controle financeiro pessoal feito com Expo, React Native, TypeScript e Firebase.

## O que já está implementado
- Cadastro e login com e-mail e senha (Firebase Authentication).
- Saldo calculado pela soma das receitas menos as despesas.
- Cadastro de recebimentos e pagamentos com valor, observação e data.
- Extrato ordenado por data decrescente.
- Dados separados por usuário no Firestore.
- Interface em tema escuro.

## 1. Instalar dependências
Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

## 2. Configurar o Firebase
1. Acesse https://console.firebase.google.com/
2. Crie um projeto.
3. Adicione um aplicativo Web ao projeto Firebase.
4. Copie as configurações do Firebase.
5. Abra `firebaseConfig.ts` e substitua os valores `SUA_API_KEY`, `SEU_PROJECT_ID` etc. pelos valores reais.
6. No Firebase Authentication, habilite o método **E-mail/senha**.
7. No Firestore Database, crie um banco de dados.

## 3. Regras iniciais do Firestore
No menu Firestore Database > Regras, use regras que permitam que cada usuário acesse somente sua própria coleção:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId}/lancamentos/{lancamentoId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Publique as regras. Não use regras abertas em produção.

## 4. Executar
```bash
npx expo start
```

Depois escaneie o QR Code com o Expo Go ou execute `npm run android` com um emulador Android configurado.

## Estrutura
```text
meu-financeiro/
  app/
    _layout.tsx
    index.tsx
    login.tsx
    cadastro.tsx
    lancamento.tsx
    extrato.tsx
  firebaseConfig.ts
  theme.ts
  app.json
  package.json
  tsconfig.json
```

## Observação sobre datas
O campo de data aceita o formato `AAAA-MM-DD`, por exemplo `2026-11-03`. Os lançamentos são ordenados pela data armazenada no Firestore.
