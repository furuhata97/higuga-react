import React, { useCallback } from 'react';

import 'react-datepicker/dist/react-datepicker.css';

import { useHistory } from 'react-router-dom';
import { Container } from './styles';

const Reports: React.FC = () => {
  const history = useHistory();

  const handleProfitSalesClick = useCallback(() => {
    history.push('/profit-sales');
  }, [history]);

  const handleProfitOrdersClick = useCallback(() => {
    history.push('/profit-orders');
  }, [history]);

  return (
    <Container>
      <h3>Relatórios</h3>
      <p>Selecione o tipo de relatório que quer visualizar</p>
      <button type="button" onClick={handleProfitSalesClick}>
        Relatório de Vendas
      </button>
      <button type="button" onClick={handleProfitOrdersClick}>
        Relatório de Pedidos
      </button>
      <button type="button">Vendas em aberto</button>
    </Container>
  );
};

export default Reports;
