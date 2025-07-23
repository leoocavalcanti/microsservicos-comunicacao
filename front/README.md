# 💳 Pagg.io — Sistema de Pagamentos (Front-End Web)

Pagg.io é uma aplicação web desenvolvida em **React** com foco em **pagamentos e controle financeiro**. O objetivo é oferecer uma experiência de login e gerenciamento de cobranças, com autenticação simulada para fins educacionais.

---

## 📌 Funcionalidades principais

- Autenticação de usuário (simulada no front-end)
- Tipos de usuário:
  - **Cliente**: realiza pagamentos e visualiza histórico
  - **Administrador**: (em breve) poderá gerenciar cobranças
- Tela de Login com validação de campos
- Exibição de mensagens de erro e redirecionamento
- Interface com design moderno, utilizando tons de roxo e azul

---

## 🎨 Paleta de Cores (UI/UX)

| Nome do tom     |  Hex       | Onde usar              |
|--------------------|-----------|-------------------------------------|
| Indigo médio    |  `#4B0082` | Fundo da tela ou botão |
| Roxo suave      |  `#6C63FF` | Marca, botões, títulos |
| Azul púrpura    |  `#5E60CE` | Fundo da tela          |
| Azul roxo claro |  `#7F77FF` | Hover, links, destaque |

Use ferramentas como [Coolors](https://coolors.co/) ou [Color Hunt](https://colorhunt.co/palette) para explorar variações e harmonias.

---

## 📁 Estrutura do Projeto

```
src/
├── components/
├── pages/
│ └── Login.js # Tela de login com validação
├── App.js # Roteamento principal
├── index.js # Entrada da aplicação React
```

---

## 🧪 Usuários simulados para testes

A autenticação é feita diretamente no front-end com um array estático de usuários:

| E-mail               | Senha   | Tipo     |
|----------------------|---------|----------|
| cliente@teste.com    | 1234    | cliente  |
| admin@teste.com      | 12345   | admin    |

---

## 🚀 Como rodar o projeto localmente

### 🔧 Pré-requisitos:

- Node.js (v18+ recomendado)
- NPM ou Yarn

### 📦 Instalação

```bash
git clone https://github.com/seu-usuario/saldozen.git
cd saldozen
npm install
```

### ▶️ Execução
```bash
npm start
```
A aplicação será aberta automaticamente em http://localhost:3000

### 🧠 Tecnologias utilizadas
- React

- React Router DOM

- HTML5 + CSS3 (inline styling simples)

- Simulação de autenticação no front-end

### 💡 Possíveis melhorias futuras
- Integração com API real (ex: login backend)

- Painel do cliente com histórico de pagamentos

- Dashboard para administradores

- Responsividade total (mobile/tablet)

- Sistema de temas (claro/escuro)

### 🧑‍🎓 Sobre
Este projeto foi desenvolvido com fins educacionais para disciplinas relacionadas a Análise e Projeto de Sistemas Orientado a Objetos e Desenvolvimento Web.