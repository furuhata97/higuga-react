import styled from 'styled-components';
import { shade } from 'polished';

export const SaleContainer = styled.div`
  height: 90%;
  color: #333;

  input {
    border: 1px solid black;
    border-radius: 8px;
    padding: 2px;
    margin-bottom: 8px;
  }

  > div {
    display: flex;
    flex-direction: column;
    width: 100%;
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

export const SaleCard = styled.div`
  background: #fff;
  border: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: left;
  padding-left: 8px;
  padding-right: 2px;

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;

    span {
      min-width: 50px;
      height: 100%;
    }
  }

  & + div {
    border-top: 2px solid #ccc;
  }

  button {
    display: flex;
    width: 120px;
    margin-left: auto;
    margin-bottom: 4px;
    margin-right: 4px;
    border: 0;
    background: #a4aa09;
    padding: 4px 0;
    color: #f2f2f2;
    border-radius: 8px;

    &:hover {
      background: ${shade(0.2, '#a4aa09')};
    }
  }

  @media (max-width: 450px) {
    font-size: 13px;
  }

  @media (max-width: 340px) {
    font-size: 12px;
  }

  img {
    margin: 4px 1px;
    height: 34px;
    width: 34px;
  }

  span {
    margin-top: 4px;
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
