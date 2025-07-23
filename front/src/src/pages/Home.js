import { useState } from "react";
import { Box, CssBaseline, AppBar, Toolbar, Typography, Grid } from "@mui/material";
import Sidebar from "../components/Siderbar";
import DashboardCard from "../components/DashboardCards";
import PaymentIcon from "@mui/icons-material/Payment";
import HistoryIcon from "@mui/icons-material/History";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MetodoPagamento from "../components/MetodoPagamento";
import Pagamento from "../components/RealizarPagamentoModal";
import AprovarPagamento from "../components/AprovaPagamento";
import HistoricoPagamentos from "../components/HistoricoModal";

const drawerWidth = 240;

export default function Home() {
  const [abaAtiva, setAbaAtiva] = useState("dashboard");

  const renderConteudo = () => {
    switch (abaAtiva) {
      case "dashboard":
        return (
          <>
            <Typography variant="h4" gutterBottom>
              Dashboard
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <DashboardCard
                  title="Pagamentos Pendentes"
                  value="5"
                  icon={<PaymentIcon />}
                  color="#4361ee"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <DashboardCard
                  title="Histórico de Transações"
                  value="20"
                  icon={<HistoryIcon />}
                  color="#4cc9f0"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <DashboardCard
                  title="Visitas ao Dashboard"
                  value="100"
                  icon={<DashboardIcon />}
                  color="#7209b7"
                />
              </Grid>
            </Grid>
          </>
        );
      case "historico":
        return <HistoricoPagamentos />;
      case "pagamento":
        return <Pagamento />;
      case "metodos":
        return <MetodoPagamento />;
      case "Aprovar Pagamento":
        return <AprovarPagamento />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: "#5E60CE",
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            💳 Pagg.io
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar setAbaAtiva={setAbaAtiva} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f5f5f5",
          p: 3,
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        {renderConteudo()}
      </Box>
    </Box>
  );
}
