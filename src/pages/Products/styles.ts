import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  display: flex;
  height: 100%;
`;

export const ProductContainer = styled.div`
  height: 90%;
  color: #333;

  overflow: scroll;

  input {
    border: 1px solid black;
    border-radius: 8px;
    padding: 2px;
  }

  > div {
    display: flex;
    flex-flow: row wrap;
    height: auto;
    align-items: center;
    justify-content: space-evenly;
    text-align: center;
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

export const NewProduct = styled.div`
  background: #fff;
  border-radius: 10px;
  margin: 12px 8px;
  border: 2px dashed #c7c7c7;
  height: 340px;
  width: 250px;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  justify-content: center;

  @media (max-width: 450px) {
    height: 332px;
    width: 220px;
  }

  @media (max-width: 340px) {
    height: 240px;
    width: 160px;
  }

  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: transparent;
    color: #c7c7c7;

    &:hover {
      color: ${shade(0.3, '#c7c7c7')};
    }
  }
`;

export const ProductCard = styled.div`
  background: #fff;
  border-radius: 10px;
  margin: 12px 8px;
  border: 0;
  box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.16);
  height: 340px;
  width: 250px;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;

  @media (max-width: 450px) {
    height: 332px;
    width: 220px;
    font-size: 13px;
  }

  @media (max-width: 340px) {
    height: 240px;
    width: 160px;
    font-size: 12px;
  }

  img {
    margin: 4px 1px;
    height: 180px;
    width: 180px;

    @media (max-width: 340px) {
      height: 120px;
      width: 120px;
    }
  }

  span {
    margin-top: 4px;
  }
`;

export const ProductButtons = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: auto;
  margin-bottom: 4px;
  padding: 0 2px;

  button {
    border: 0;
    background: transparent;
    font-size: 13px;
    font-weight: 500;
    padding: 4px;
    color: #0066c0;

    &:hover {
      color: ${shade(0.5, '#0066c0')};
    }

    & + button {
      border-left: 1px solid #0066c0;
    }

    @media (max-width: 340px) {
      font-size: 10px;
      font-weight: 300;
    }
  }

  @media (max-width: 420px) {
    font-size: 12px;
  }
`;

export const Loading = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  color: black;
  align-items: center;
  justify-content: center;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(359deg);
    }
  }

  p {
    margin-left: 4px;
  }

  svg {
    animation: spin 2s linear infinite;
  }
`;
