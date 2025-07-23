import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Pagamento() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const userId = usuario?.uuid;
  

  const [metodos, setMetodos] = useState([]);
  const [formData, setFormData] = useState({
    valor: "",
    descricao: "",
    idMetodoPagamento: "",
  });
  const [mensagem, setMensagem] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState("info");

  const fetchMetodosPagamento = async () => {
    try {
      const res = await axios.get("http://localhost/payment-method/payment_method", {
        params: { user: userId },
      });
      setMetodos(res.data);
    } catch (err) {
      console.error("Erro ao buscar métodos:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMetodosPagamento();
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePagamento = async () => {
    try {
      const response = await axios.post('/api/pagamentos', {
        ...formData,
        idUsuario: userId,
      });

      const pagamento = response.data;

      localStorage.setItem("ultimoPagamento", JSON.stringify(pagamento));

      // Aqui usa a mensagem que vem da API
      setMensagem(pagamento.mensagem);
      setAlertSeverity(pagamento.status === "aprovado" ? "success" : "warning");

      setFormData({
        valor: "",
        descricao: "",
        idMetodoPagamento: "",
      });
    } catch (err) {
      console.error("Erro ao criar pagamento:", err);
      setMensagem("Erro ao processar pagamento.");
      setAlertSeverity("error");
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Realizar Pagamento
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Valor"
            name="valor"
            type="number"
            fullWidth
            value={formData.valor}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Descrição"
            name="descricao"
            fullWidth
            value={formData.descricao}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel id="metodo-label">Método de Pagamento</InputLabel>
            <Select
              labelId="metodo-label"
              name="idMetodoPagamento"
              value={formData.idMetodoPagamento}
              onChange={handleChange}
              label="Método de Pagamento"
            >
              {metodos.map((m) => (
                <MenuItem key={m.uuid} value={m.uuid}>
                  {m.owner_name} - {m.card_number.replace(/.(?=.{4})/g, "*")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" onClick={handlePagamento}>
            Pagar
          </Button>
        </Grid>
      </Grid>

      {mensagem && (
        <Alert severity={alertSeverity} sx={{ mt: 2 }}>
          {mensagem}
        </Alert>
      )}
    </Box>
  );
}
