import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import PaymentIcon from "@mui/icons-material/Payment";
import CreditCardIcon from "@mui/icons-material/CreditCard";

const drawerWidth = 240;

export default function Sidebar({ setAbaAtiva }) {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#5E60CE",
          color: "white"
        }
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setAbaAtiva("dashboard")}>
            <ListItemIcon sx={{ color: "white" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setAbaAtiva("historico")}>
            <ListItemIcon sx={{ color: "white" }}>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary="Histórico" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setAbaAtiva("pagamento")}>
            <ListItemIcon sx={{ color: "white" }}>
              <PaymentIcon />
            </ListItemIcon>
            <ListItemText primary="Pagamento" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setAbaAtiva("metodos")}>
            <ListItemIcon sx={{ color: "white" }}>
              <CreditCardIcon />
            </ListItemIcon>
            <ListItemText primary="Métodos" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setAbaAtiva("Aprovar Pagamento")}>
            <ListItemIcon sx={{ color: "white" }}>
              <CreditCardIcon />
            </ListItemIcon>
            <ListItemText primary="Aprovar Pagamento" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
