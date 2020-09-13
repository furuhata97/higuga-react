import React, { useCallback } from 'react';

import 'react-datepicker/dist/react-datepicker.css';

import { useHistory } from 'react-router-dom';
import { Container } from './styles';

const Reports: React.FC = () => {
  const history = useHistory();

  const handleProfitClick = useCallback(() => {
    history.push('/profit');
  }, [history]);

  return (
    <Container>
      <h3>Relatórios</h3>
      <p>Selecione o tipo de relatório que quer visualizar</p>
      <button type="button" onClick={handleProfitClick}>
        Relatório de Lucro
      </button>
      <button type="button">Relatório de Vendas</button>
      <button type="button">Relatório de Pedidos</button>
      <button type="button">Vendas em aberto</button>
    </Container>
  );
};

export default Reports;
