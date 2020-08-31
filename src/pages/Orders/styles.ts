import styled from 'styled-components';

import ordersBackground from '../../assets/orders_background.jpg';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const OrdersContainer = styled.div`
  height: 100%;
  background: url(${ordersBackground}) no-repeat center;
  background-size: cover;
  flex: 1;
  color: #333;
  h2 {
    margin: 12px;
  }
`;

export const OrderContent = styled.div`
  background: #fff;
  opacity: 0.95;
  border-radius: 8px;
  margin: 12px;
  display: flex;
  flex-direction: column;
`;

export const OrderTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #096faa;
  color: #f2f2f2;
  min-height: 32px;
  padding: 12px;
  border-radius: 8px 8px 0 0;
`;

export const ProductDetail = styled.div`
  margin: 12px;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  @media (max-width: 420px) {
    font-size: 11px;
  }

  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 4;
    box-sizing: border-box;

    img {
      height: 45px;
      width: 45px;
    }

    @media (max-width: 320px) {
      flex-direction: column;
    }
  }
`;

export const OrderFooter = styled.div`
  display: flex;
  flex-direction: column;
  margin: 12px;

  @media (max-width: 420px) {
    font-size: 12px;
  }
`;
