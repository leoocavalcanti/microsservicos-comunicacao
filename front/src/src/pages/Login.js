import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  // Usuários com UUID fixo
  const usuarios = [
    {
      email: "cliente@teste.com",
      senha: "1234",
      tipo: "cliente",
      uuid: "11111111-1111-1111-1111-111111111111",
    },
    {
      email: "admin@teste.com",
      senha: "12345",
      tipo: "admin",
      uuid: "22222222-2222-2222-2222-222222222222",
    },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    const usuario = usuarios.find(
      (u) => u.email === email && u.senha === senha
    );

    if (usuario) {
      // Salva dados do usuário no localStorage para uso global
      localStorage.setItem("usuario", JSON.stringify(usuario));
      navigate("/home");
    } else {
      setErro("E-mail ou senha inválidos.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h1 style={styles.marca}>Pagg.io</h1>
        <h2 style={styles.titulo}>Login</h2>
        {erro && <p style={styles.erro}>{erro}</p>}
        <input
          style={styles.input}
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit" style={styles.botao}>
          Entrar
        </button>
        <button
          type="button"
          onClick={() => alert("Função ainda não implementada.")}
          style={styles.esqueci}
        >
          Esqueci minha senha
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#5E60CE",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 8,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "300px",
    display: "flex",
    flexDirection: "column",
  },
  marca: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "sans-serif",
    color: "#5E60CE",
    letterSpacing: 1,
  },
  titulo: {
    textAlign: "center",
    marginBottom: 20,
    color: "#6C63FF",
  },
  input: {
    padding: 10,
    marginBottom: 15,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  botao: {
    padding: 10,
    backgroundColor: "#6C63FF",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    marginBottom: 10,
  },
  esqueci: {
    background: "none",
    border: "none",
    color: "#7F77FF",
    cursor: "pointer",
    fontSize: 14,
  },
  erro: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
};
