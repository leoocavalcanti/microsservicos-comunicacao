// src/pages/Pagamento.js
import { useState } from 'react';

export default function Pagamento() {
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('PIX');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Pagamento de R$${valor} via ${tipo} enviado!`);
    // Aqui você pode mandar para uma API
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Fazer Pagamento</h2>
      <label>Valor:
        <input type="number" value={valor} onChange={e => setValor(e.target.value)} required />
      </label><br/>
      <label>Tipo:
        <select value={tipo} onChange={e => setTipo(e.target.value)}>
          <option>PIX</option>
          <option>Crédito</option>
          <option>Débito</option>
        </select>
      </label><br/>
      <label>Descrição:
        <input type="text" value={descricao} onChange={e => setDescricao(e.target.value)} />
      </label><br/>
      <button type="submit">Enviar Pagamento</button>
    </form>
  );
}
