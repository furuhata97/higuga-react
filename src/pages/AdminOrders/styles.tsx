import { shade } from 'polished';
import styled from 'styled-components';

interface SelectButtonProps {
  selected: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  color: #333;

  > div {
    margin-top: 12px;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 450px) {
      min-height: 70px;
      overflow: scroll;

      &:-webkit-scrollbar {
        display: none;
      }

      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  }

  .pagination {
    margin: 1rem auto;
    list-style: none;
    display: flex;
    justify-content: space-evenly;
    width: 50%;

    @media (max-width: 450px) {
      width: 100%;
      font-size: 11px;
    }
  }
  .active {
    border: 1px solid black;
    border-radius: 10%;
    padding: 0 8px;
    outline: none;
    background: rgba(170, 67, 0, 0.84);
    color: #fff5ea;
  }

  ul {
    cursor: pointer;
    color: black;
  }
`;

export const SelectButton = styled.button<SelectButtonProps>`
  border: 0;
  border-bottom: 2px solid transparent;
  width: 124px !important;
  height: 100%;
  padding: 0 8px;
  background: ${(props) => (props.selected ? '#ff9000' : 'transparent')};

  &:first-child {
    margin-left: 100px;
    width: 136px;
  }

  &:hover {
    border-bottom: 2px solid #333;
  }
`;

export const OrderContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  height: auto;
  width: 100%;

  > p {
    width: 100%;
    background: #fff;
    text-align: left;
    font-size: 14px;
    padding-left: 4px;
    font-weight: 400;
    margin: 0 0 4px 0;
  }

  > div {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;

    img {
      width: 32px;
      height: 32px;
    }

    > p {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      text-align: center;
      font-size: 14px;
      height: 100%;
      padding: 0 8px;

      @media (max-width: 320px) {
        font-size: 11px;
      }

      @media (max-width: 280px) {
        font-size: 10px;
      }

      & + p {
        border-left: 1px solid #333;
      }
    }
  }

  & + div {
    margin-top: 8px;
  }
`;

export const OrderHeader = styled.p`
  width: 100%;
  background: #096faa !important;
  color: #f2f2f2 !important;
  text-align: left;
  padding: 4px;
  margin: 0 !important;
`;

export const Orders = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start !important;
  height: 100% !important;
  margin-bottom: auto;
`;

export const SelectStatus = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 12px;
  padding-bottom: 4px;

  button {
    border: 0;
    border-radius: 8px;
    background: #a4aa09;
    min-width: 110px;
    min-height: 60px;
    color: #f2f2f2;

    &:hover {
      background: ${shade(0.2, '#a4aa09')};
    }
  }
`;
