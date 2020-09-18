import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface LeftMenuProps {
  isHidden: boolean;
}

interface MenuButtonProps {
  isSelected: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Content = styled.div`
  background: #f2f2f2;
  display: flex;
  flex: 1;

  @media (max-width: 450px) {
    flex-direction: column;
  }
`;

export const MenuButton = styled.button<MenuButtonProps>`
  ${(props) =>
    props.isSelected
      ? css`
          background: #b6866e;
        `
      : css`
          background: transparent;
        `}

  &:hover {
    background: ${(props) =>
      props.isSelected ? shade(0.1, '#b6866e') : shade(0.1, '#fff5ea')};
  }
`;

export const LeftMenu = styled.aside<LeftMenuProps>`
  display: flex;
  flex-direction: row;
  height: 100%;
  ${(props) =>
    props.isHidden
      ? css`
          width: 20px;
        `
      : css`
          width: 150px;
        `}

  @media (max-width: 450px) {
    height: 64px;

    ${(props) =>
      props.isHidden
        ? css`
            width: 20px;
          `
        : css`
            width: 100%;
          `}
  }

  div {
    ${(props) =>
      props.isHidden
        ? css`
            display: none;
          `
        : css`
            display: flex;
          `}
    flex-direction: column;
    align-items: center;
    width: 100%;
    background: #fff5ea;

    @media (max-width: 450px) {
      flex-direction: row;
      overflow: scroll;
    }

    ${MenuButton} {
      width: 100%;
      padding: 4px;

      & + button {
        border-top: 1px solid #c2c2c2;
      }

      @media (max-width: 450px) {
        height: 100%;
        & + button {
          border-top: 0;
        }
      }
    }
  }

  button {
    border: 0;
  }

  > button {
    width: 20px;
    background: #c0c0c0;

    &:hover {
      background: ${shade(0.2, '#c0c0c0')};
    }
  }
`;

export const ItemContainer = styled.div`
  height: 100%;
  width: 100%;
  padding: 8px;

  p {
    font-size: 18px;
    font-weight: 500;
    color: #282828;
  }

  > span {
    width: 100%;
    text-align: center;
    color: #282828;
    font-size: 14px;

    @media (max-width: 450px) {
      font-size: 12px;
    }
  }
`;
