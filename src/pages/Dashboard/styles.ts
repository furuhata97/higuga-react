import styled from 'styled-components';
import { shade } from 'polished';

interface CategoryButtonProps {
  selected: boolean;
}

export const Container = styled.div`
  background: #fff;
  display: flex;
  flex-direction: row;
  flex: 1;
  @media (max-width: 450px) {
    flex-direction: column;
  }

  @media only screen and (max-device-width: 736px) {
    height: 100vh;
    width: 100vw;
  }
`;

Container.displayName = 'DashboardContainer';

export const CategoriesContainer = styled.aside`
  width: 300px;
  background: #f3f3f3;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* @media (max-width: 550px) {
    width: 110px;
  }

  @media (max-width: 280px) {
    width: 80px;
  } */

  @media (max-width: 450px) {
    flex-direction: row;
    width: 100%;
    overflow: scroll;
  }
`;

CategoriesContainer.displayName = 'CategoriesContainer';

export const CategoryContainerTitle = styled.h3`
  color: #000000;
  font-style: normal;
  font-weight: 200;
  font-size: 20px;
  line-height: 43px;

  @media (max-width: 450px) {
    font-size: 10px;
    margin-right: 2px;
  }
`;

export const CategoryContent = styled.div`
  height: 53px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  & + div {
    margin-top: 12px;
  }

  @media (max-width: 450px) {
    min-width: 76px;
    & + div {
      margin-top: 0;
      margin-left: 2px;
    }
  }
`;

export const CategoryButton = styled.button<CategoryButtonProps>`
  flex: 1;
  height: 100%;
  border: 0;
  background: ${(props) => (props.selected ? '#ff9000' : '#d1d1d1')};

  &:hover {
    background: ${(props) =>
      props.selected ? shade(0.2, '#ff9000') : shade(0.2, '#d1d1d1')};
  }
`;

export const CategoryTitle = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: 18px;

  @media (max-width: 450px) {
    font-size: 10px;
    padding: 4px;
  }
`;

export const ProductsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

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

export const SearchTyped = styled.div`
  margin: 8px 0 4px 24px;

  p {
    color: #202020;
  }

  span {
    color: #802d2d;
  }
`;

export const CategorySelected = styled.div`
  margin: 8px 0 4px 24px;

  p {
    color: #202020;
  }

  span {
    color: #802d2d;
  }
`;

export const FoundProductsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  /* flex: 1; */
  height: auto;
  align-items: center;
  justify-content: center;
  text-align: center;

  > h3 {
    color: #000;
    flex: 1;
  }
`;

FoundProductsContainer.displayName = 'ContainerListProducts';

export const HandleCardAmount = styled.div`
  flex-direction: column;
  flex: 1;

  > div {
    display: flex;
    flex-direction: row;
    flex: 1;

    margin: 4px 10px;
    border: 0;

    svg {
      color: #7eb946;
    }

    @media (max-width: 550px) {
      font-size: 10px;
      padding: 0 4px;
      height: 30px;
      margin: 12px 2px 12px 2px;
    }
  }

  > button {
    border-radius: 2px;
    height: 35px;
    margin: 10px;
    background: #e6421e;
    color: #fff;
    border: 0;
    font-weight: 300;
    transition: background-color 0.2s;

    &:hover {
      background: ${shade(0.2, '#e6421e')};
    }

    @media (max-width: 550px) {
      font-size: 10px;
      padding: 0 4px;
      height: 30px;
      margin: 12px 2px 12px 2px;
    }
  }

  @media (max-width: 550px) {
    flex-direction: row;
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

export const ProductCard = styled.div`
  margin: 4px;
  border: 0;
  height: 340px;
  width: 250px;
  display: flex;
  flex-direction: column;
  position: relative;

  .top-product {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    height: 100%;
  }

  ${HandleCardAmount} {
    display: none;
  }

  &:hover {
    ${HandleCardAmount} {
      display: flex;
    }
  }

  &:hover {
    top: -2px;
    box-shadow: 3px 3px 5px 6px #ccc;
    -webkit-box-shadow: 3px 3px 5px 6px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
    -moz-box-shadow: 3px 3px 5px 6px #ccc;
    border: 0;
  }

  @media (max-width: 550px) {
    height: 250px;
    width: 100%;

    .top-product {
      flex-direction: row;
    }

    & + div {
      border-top: 1px solid #ccc;
    }

    ${HandleCardAmount} {
      display: flex;
    }
  }

  @media (max-width: 290px) {
    height: 244px;
    width: 220px;

    .top-product {
      flex-direction: row;
    }

    & + div {
      border-top: 1px solid #ccc;
    }

    ${HandleCardAmount} {
      display: flex;
    }
  }
`;

export const ProductImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: black;
  }

  img {
    margin: 0;
    height: 188px;
    width: 188px;

    @media (max-width: 550px) {
      height: 128px;
      width: 128px;
    }

    @media (max-width: 290px) {
      height: 120px;
      width: 120px;
    }
  }
`;

export const ProductInfo = styled.div`
  background: transparent;
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  p {
    color: #000000;
    font-size: 14px;
    font-weight: 300;
    margin-left: 4px;
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
`;

export const SetQuantityButton = styled.button`
  background: linear-gradient(to bottom, #fff 0, #f2f2f2 100%);
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
`;
