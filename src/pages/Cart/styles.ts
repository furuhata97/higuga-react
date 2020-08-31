import styled from 'styled-components';
import { lighten, shade } from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #b6866e;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 32px;
  margin-bottom: 16px;

  h2 {
    margin-left: 32px;
    margin-bottom: 8px;
  }
`;

export const CartItems = styled.div`
  height: 100%;
  margin: 0 32px;
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 12px;

  @media (max-width: 650px) {
    margin: 0;
  }
`;

export const ItemsHeader = styled.nav`
  display: flex;
  background: #333;
  color: #aaa;
  min-height: 32px;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 10px 10px 0 0;

  &:first-child {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 650px) {
    font-size: 12px;
  }

  > div {
    flex: 4;
    padding-left: 4px;
    padding: 5px;
    box-sizing: border-box;

    &:nth-child(1) {
      flex: 4;
    }

    &:nth-child(2) {
      flex: 2;
    }

    &:nth-child(4) {
      flex: 2;
    }

    &:nth-child(5) {
      flex: 1;
    }
  }
`;

export const ItemsFooter = styled.nav`
  display: flex;
  flex-direction: column;
  background: #f2f2f2;
  color: #333;
  min-height: 64px;
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  align-items: center;
  margin-top: auto;
  border-radius: 0 0 10px 10px;

  > div {
    display: flex;
    flex-direction: row;
    width: 100%;

    .right-item {
      display: flex;
      justify-content: flex-end;
    }

    &:first-child {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    @media (max-width: 650px) {
      font-size: 12px;
    }

    > div {
      flex: 4;
      padding-left: 4px;
      padding: 5px;
      box-sizing: border-box;

      > button {
        background: #4bb543;
        color: #fff;
        border: 0;
        font-weight: 300;
        font-size: 12px;
        padding: 4px;
        border-radius: 8px;

        &:hover {
          background: ${shade(0.2, '#4BB543')};
        }
      }
    }
  }
`;

export const ItemsContent = styled.nav`
  display: flex;
  background: transparent;
  color: #333;
  padding: 5px;
  box-sizing: border-box;
  align-items: center;
  margin: 0 4px;

  & + nav {
    border-top: 1px solid #aaa;
  }

  &:first-child .cell {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 650px) {
    font-size: 12px;
  }

  > div {
    flex: 4;
    padding-left: 4px;
    padding: 5px;
    box-sizing: border-box;

    button {
      background: transparent;
      border: 0;

      &:hover {
        color: ${lighten(0.4, '#000')};
      }
    }

    &:nth-child(1) {
      flex: 4;
    }

    &:nth-child(2) {
      flex: 2;
    }

    &:nth-child(4) {
      flex: 2;
    }

    &:nth-child(5) {
      flex: 1;
    }
  }
`;

export const ProductTitle = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 12px;
  justify-content: start;
  align-items: center;

  @media (max-width: 550px) {
    font-size: 10px;
  }

  @media (max-width: 280px) {
    flex-direction: column;
  }

  img {
    height: 50px;
    width: 50px;
    margin-right: 4px;

    @media (max-width: 600px) {
      height: 38px;
      width: 38px;
    }
  }
`;

export const SetQuantityButton = styled.button`
  background: linear-gradient(to bottom, #f2f2f2 0, #ccc 100%) !important;
  border: 1px solid #ccc;
  min-width: 32px;
  min-height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#f2f2f2')};

    svg {
      color: #fff;
    }
  }

  @media (max-width: 550px) {
    max-width: 25px;
    max-height: 25px;
  }

  @media (max-width: 320px) {
    min-width: 18px;
    min-height: 18px;
    max-width: 20px;
    max-height: 20px;
  }
`;

export const Quantity = styled.div`
  background: transparent;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  width: 100%;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    color: black;
  }

  @media (max-width: 550px) {
    min-width: 25px;
  }

  @media (max-width: 320px) {
    min-width: 18px;
    min-height: 18px;
    max-width: 20px;
    max-height: 20px;
  }
`;

export const HandleCardAmount = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;

  border: 0;

  max-width: 120px;

  svg {
    color: #7eb946;
  }

  @media (max-width: 550px) {
    font-size: 10px;
    padding: 0 4px;
    height: 30px;
    margin: 12px 2px 12px 2px;
  }
`;
