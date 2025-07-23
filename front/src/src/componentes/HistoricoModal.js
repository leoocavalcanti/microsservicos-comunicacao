import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const HISTORICO_KEY = "historicoPagamentosIds";

export default function HistoricoPagamentos() {
  const [pagamentos, setPagamentos] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const getStatusColor = (status) => {
    if (status === "aprovado") return "green";
    if (status === "recusado") return "red";
    return "gray";
  };

  const getStatusIcon = (status) => {
    if (status === "aprovado") return "✅";
    if (status === "recusado") return "❌";
    return "ℹ️";
  };

  useEffect(() => {
    const buscarPagamentos = async () => {
      const ids = JSON.parse(localStorage.getItem(HISTORICO_KEY)) || [];

      if (ids.length === 0) {
        setErro("Nenhum pagamento no histórico.");
        setCarregando(false);
        return;
      }

      try {
        const respostas = await Promise.all(
          ids.map((id) => axios.get(`/api/pagamentos/${id}`))
        );

        const dados = respostas.map((res) => res.data);
        setPagamentos(dados);
      } catch (err) {
        console.error(err);
        setErro("Erro ao buscar histórico de pagamentos.");
      } finally {
        setCarregando(false);
      }
    };

    buscarPagamentos();
  }, []);

  if (carregando) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (erro) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {erro}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Histórico de Pagamentos
      </Typography>

      <Grid container spacing={2}>
        {pagamentos.map((p) => (
          <Grid item xs={12} md={6} key={p.pagamento.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Pagamento</Typography>
                <Typography>ID: {p.pagamento.id}</Typography>
                <Typography>Valor: R$ {p.pagamento.valor}</Typography>
                <Typography sx={{ fontWeight: "bold", mt: 1 }}>
                  Status:{" "}
                  <Box
                    component="span"
                    sx={{ color: getStatusColor(p.status_atual.status) }}
                  >
                    {getStatusIcon(p.status_atual.status)}{" "}
                    {p.status_atual.status}
                  </Box>
                </Typography>

                <Typography>Descrição: {p.pagamento.descricao}</Typography>
                <Typography>
                  Atualizado em:{" "}
                  {new Date(p.status_atual.ultima_atualizacao).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
