import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Pagamento from './pages/Pagamento';
import Historico from './pages/Historico';
import Login from './pages/Login';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/historico" element={<Historico />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
