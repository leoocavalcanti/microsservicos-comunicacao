// src/pages/Historico.js
const historicoMock = [
    { id: 1, data: '2025-07-06', valor: 99.90, tipo: 'Crédito', descricao: 'Compra Amazon' },
    { id: 2, data: '2025-07-01', valor: 49.50, tipo: 'PIX', descricao: 'Pagamento IFood' },
  ];
  
  export default function Historico() {
    return (
      <div>
        <h2>Histórico de Pagamentos</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Data</th>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            {historicoMock.map(p => (
              <tr key={p.id}>
                <td>{p.data}</td>
                <td>R$ {p.valor.toFixed(2)}</td>
                <td>{p.tipo}</td>
                <td>{p.descricao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  