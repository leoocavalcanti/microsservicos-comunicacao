import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function AprovarPagamento() {
  const ultimoPagamento = JSON.parse(localStorage.getItem("ultimoPagamento"));
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  const buscarDetalhes = async () => {
    try {
      const res = await axios.get(
        `/api/pagamentos/${ultimoPagamento.pagamentoId}`
      );
      setResultado(res.data);
    } catch (err) {
      console.error(err);
      setErro("Erro ao buscar detalhes do pagamento.");
    }
  };
  const HISTORICO_KEY = "historicoPagamentosIds";

  function adicionarIdNoHistorico(id) {
    // Pega a lista atual do localStorage
    const historicoAtual =
      JSON.parse(localStorage.getItem(HISTORICO_KEY)) || [];

    // Se já tiver o id, não adiciona de novo
    if (!historicoAtual.includes(id)) {
      historicoAtual.push(id);
      localStorage.setItem(HISTORICO_KEY, JSON.stringify(historicoAtual));
    }
  }

  const handleAcao = async (acao) => {
    if (!ultimoPagamento?.pagamentoId) {
      setErro("Nenhum pagamento encontrado no localStorage.");
      return;
    }

    try {
      const res = await axios.post(
        `/api/pagamentos/${ultimoPagamento.pagamentoId}/${acao}`
      );
      setResultado(res.data);
      setErro(null);

      if (res.data?.id) {
        adicionarIdNoHistorico(res.data.id);
      }
    } catch (err) {
      console.error(err);
      setErro(
        `Erro ao ${acao === "aprovar" ? "aprovar" : "rejeitar"} pagamento.`
      );
    }
  };

  const renderCard = () => {
    if (!resultado) return null;

    const pagamento = resultado?.pagamento ?? {};
    const statusAtual = resultado?.status_atual ?? {};
    const evento = pagamento?.eventos?.[0];
    const detalhes = evento ? JSON.parse(evento.conteudoJson) : null;

    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6">Detalhes do Pagamento</Typography>
          <Typography>ID: {pagamento.id}</Typography>
          <Typography>Valor: R$ {pagamento.valor}</Typography>
          <Typography>Status: {statusAtual.status}</Typography>
          <Typography>Descrição: {pagamento.descricao}</Typography>
          <Typography>
            Atualizado em:{" "}
            {statusAtual.ultima_atualizacao
              ? new Date(statusAtual.ultima_atualizacao).toLocaleString()
              : "—"}
          </Typography>

          {detalhes && (
            <>
              <Typography sx={{ mt: 2 }}>🔍 Detalhes do Evento:</Typography>
              <Typography>Bandeira: {detalhes.detalhes?.bandeira}</Typography>
              <Typography>Tipo: {detalhes.detalhes?.tipo}</Typography>
              <Typography>
                Últimos dígitos: **** {detalhes.detalhes?.ultimos_digitos}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Aprovar/Rejeitar Pagamento
      </Typography>

      <Grid container spacing={2}>
        <Grid item>
          <Button variant="outlined" color="primary" onClick={buscarDetalhes}>
            Buscar Detalhes
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleAcao("aprovar")}
          >
            ✅ Aprovar
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleAcao("rejeitar")}
          >
            ❌ Rejeitar
          </Button>
        </Grid>
      </Grid>

      {erro && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {erro}
        </Alert>
      )}

      {renderCard()}
    </Box>
  );
}
