/* eslint-disable no-restricted-globals */
import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface InputProps {
  isFocused: boolean;
}

export const Header = styled.header`
  width: 100%;
  padding: 16px 0;
  background: rgba(170, 67, 0, 0.84);
`;

export const HeaderContent = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .bm-burger-button {
    position: relative;
    width: 26px;
    height: 20px;
    left: 15px;
    top: 0px;

    @media (min-width: 395px) {
      display: none;
    }
  }

  .bm-burger-bars {
    background: #fff;
  }

  .bm-burger-bars-hover {
    background: ${shade(0.1, '#fff')};
  }

  .bm-cross-button {
    height: 24px;
    width: 24px;

    @media (max-width: 280px) {
      left: 240px;
    }
  }

  /* Color/shape of close button cross */
  .bm-cross {
    background: #bdc3c7;
  }

  /*
Sidebar wrapper styles
Note: Beware of modifying this element as it can break the animations - you should not need to touch it in most cases
*/
  .bm-menu-wrap {
    position: fixed;
    height: 100%;
    top: 0px;
  }

  /* General sidebar styles */
  .bm-menu {
    background: #373a47;
    padding: 2.5em 1.5em 0;
    font-size: 1.15em;

    @media (max-width: 280px) {
      width: 270px;
    }
  }

  /* Morph shape necessary with bubble or elastic */
  .bm-morph-shape {
    fill: #373a47;
  }

  /* Wrapper for item list */
  .bm-item-list {
    color: #fff;
    padding: 0.8em;
  }

  /* Individual item */
  .bm-item {
    display: inline-block;
  }

  /* Styling of overlay */
  .bm-overlay {
    background: rgb(144, 104, 104, 0.7) !important;
    top: 0;
  }

  .menu-item {
    text-decoration: none;
    color: #fff;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;

    svg {
      margin-right: 4px;
    }
  }

  > img {
    height: 75px;
    padding-left: 12px;

    @media (max-width: 690px) {
      height: 30px;
    }

    @media (max-width: 395px) {
      margin-left: 45px;
    }

    @media (max-width: 320px) {
      height: 25px;
      padding: 0;
      margin-left: 25px;
    }

    @media (max-width: 290px) {
      display: none;
    }
  }
`;

export const SearchBar = styled.div<InputProps>`
  background: #ffffff;
  border-radius: 50px;
  border: 0;
  padding: 4px;
  width: 70%;
  color: #666360;
  margin: 0 12px;

  display: flex;

  @media (max-width: 690px) {
    height: 18px;
    width: 300px;
  }

  @media (max-width: 290px) {
    margin-left: 60px;
  }

  ${(props) =>
    props.isFocused &&
    css`
      border: 2px solid #666360;
    `}

  form {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;

    input {
      flex: 1;
      background: transparent;
      border: 0px;
      font-family: Roboto Slab;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      padding-left: 4px;

      @media (max-width: 690px) {
        height: 14px;
        font-size: 9px;
      }
    }

    button {
      margin-left: auto;
      background: transparent;
      border: 0;

      svg {
        color: #000;
        width: 24px;
        height: 24px;

        @media (max-width: 690px) {
          height: 13px;
          width: 13px;
        }
      }
    }
  }
`;

export const LoginButton = styled.div`
  padding: 0 15px;

  @media (max-width: 395px) {
    display: none;
  }

  a {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    text-decoration: none;

    svg {
      color: #ffffff;
      height: 30px;
      width: 30px;

      @media (max-width: 690px) {
        height: 15px;
        width: 15px;
      }
    }

    &:hover {
      div {
        color: ${shade(0.2, '#fff')};
      }

      svg {
        color: ${shade(0.2, '#fff')};
      }
    }
  }
`;

export const LoginText = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;
  margin-left: 8px;
  font-size: 14px;

  @media (max-width: 690px) {
    font-size: 10px;
  }
`;

export const CartButton = styled.div`
  /* margin-left: auto; */
  padding-right: 8px;

  a {
    text-decoration: none;
    display: flex;
    flex-direction: row;

    svg {
      color: #fff;
      height: 32px;
      width: 32px;

      @media (max-width: 690px) {
        height: 16px;
        width: 16px;
      }
    }
  }
`;

export const CircleCounter = styled.div`
  background: radial-gradient(
    circle closest-side,
    #471a1a 0%,
    #471a1a 98%,
    rgba(0, 0, 0, 0) 100%
  );
  height: 26px;
  width: 26px;
  text-align: center;
  position: relative;
  left: -10px;
  top: -10px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 690px) {
    height: 12px;
    width: 12px;
    left: -4px;
    top: -4px;
  }

  span {
    color: #fff;
    font-size: 12px;

    @media (max-width: 690px) {
      font-size: 8px;
    }
  }
`;

export const UserProfileButton = styled.div`
  display: flex;
  padding: 8px;

  @media (max-width: 395px) {
    display: none;
  }

  a {
    text-decoration: none;
    color: #fff;
    &:hover {
      color: ${shade(0.1, '#fff')};
    }
    @media (max-width: 450px) {
      font-size: 7px;
    }
  }
`;

export const ExitContainer = styled.div`
  display: flex;
  padding: 8px;

  @media (max-width: 395px) {
    display: none;
  }
`;

export const ExitButton = styled.button`
  background: transparent;
  border: 0;
  color: #fff;

  &:hover {
    color: ${shade(0.1, '#fff')};
  }

  @media (max-width: 450px) {
    font-size: 7px;
  }
`;

export const ExitButtonNav = styled.div`
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  span {
    color: #fff;
    font-size: 18px;
  }

  svg {
    margin-right: 4px;
    color: #fff;
  }

  button {
    background: transparent;
    border: 0;
  }
`;
