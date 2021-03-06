import React, { useState, useCallback } from 'react';
import { FiChevronLeft } from 'react-icons/fi';

import {
  Container,
  Content,
  LeftMenu,
  MenuButton,
  ItemContainer,
} from './styles';
import Header from '../../components/GenericHeader';
import Products from '../Products';
import Categories from '../Categories';
import Clients from '../Clients';
import Reports from '../Reports';
import NewSale from '../NewSale';
import UnfinishedSales from '../UnfinishedSales';
import AdminOrders from '../AdminOrders';
import ProductRemoval from '../ProductRemoval';

const AdminArea: React.FC = () => {
  const [hideClick, setHideClick] = useState(false);
  const [selectedOption, setSelectedOption] = useState(1);

  const handleHideClick = useCallback(() => {
    setHideClick(!hideClick);
  }, [hideClick]);

  const handleSelectedOptionClick = useCallback((id: number) => {
    setSelectedOption(id);
  }, []);

  return (
    <Container>
      <Header back="/" text="Voltar a loja" />
      <Content>
        <LeftMenu isHidden={hideClick}>
          <div>
            <MenuButton
              type="button"
              onClick={() => handleSelectedOptionClick(1)}
              isSelected={selectedOption === 1}
            >
              Produtos
            </MenuButton>
            <MenuButton
              type="button"
              onClick={() => handleSelectedOptionClick(2)}
              isSelected={selectedOption === 2}
            >
              Categorias
            </MenuButton>
            <MenuButton
              type="button"
              onClick={() => handleSelectedOptionClick(3)}
              isSelected={selectedOption === 3}
            >
              Clientes
            </MenuButton>
            <MenuButton
              type="button"
              onClick={() => handleSelectedOptionClick(4)}
              isSelected={selectedOption === 4}
            >
              {' '}
              Relatórios
            </MenuButton>
            <MenuButton
              type="button"
              onClick={() => handleSelectedOptionClick(5)}
              isSelected={selectedOption === 5}
            >
              {' '}
              Nova Venda
            </MenuButton>
            <MenuButton
              type="button"
              onClick={() => handleSelectedOptionClick(6)}
              isSelected={selectedOption === 6}
            >
              {' '}
              Vendas em Aberto
            </MenuButton>
            <MenuButton
              type="button"
              onClick={() => handleSelectedOptionClick(7)}
              isSelected={selectedOption === 7}
            >
              {' '}
              Pedidos
            </MenuButton>
            <MenuButton
              type="button"
              onClick={() => handleSelectedOptionClick(8)}
              isSelected={selectedOption === 8}
            >
              {' '}
              Retirar produto
            </MenuButton>
          </div>
          <button type="button" onClick={handleHideClick}>
            <FiChevronLeft />
          </button>
        </LeftMenu>
        <ItemContainer>
          <span>Área administrativa</span>
          {selectedOption === 1 ? <Products /> : null}
          {selectedOption === 2 ? <Categories /> : null}
          {selectedOption === 3 ? <Clients /> : null}
          {selectedOption === 4 ? <Reports /> : null}
          {selectedOption === 5 ? <NewSale /> : null}
          {selectedOption === 6 ? <UnfinishedSales /> : null}
          {selectedOption === 7 ? <AdminOrders /> : null}
          {selectedOption === 8 ? <ProductRemoval /> : null}
        </ItemContainer>
      </Content>
    </Container>
  );
};

export default AdminArea;
