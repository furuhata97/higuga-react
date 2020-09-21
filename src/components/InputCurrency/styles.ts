import styled, { css } from 'styled-components';

interface CurrencyInputProps {
  selected: boolean;
  disabled: boolean;
}

export const Container = styled.fieldset<CurrencyInputProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 100%;
  border: 1px solid rgb(195, 195, 195);
  border-radius: 4px;
  margin-top: 4px;
  color: #333;
  ${(props) =>
    props.disabled &&
    css`
      color: rgb(195, 195, 195);
    `}
  padding-left: 4px;

  legend {
    padding: 0 8px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.54);

    background: inherit;
    overflow: auto;
  }

  div {
    margin-top: 4px;
  }

  input {
    border: 0;
    background: transparent;
    ${(props) =>
      props.disabled &&
      css`
        color: rgb(195, 195, 195);
      `}
  }

  &:hover {
    border: 1px solid black;
    ${(props) =>
      props.selected &&
      css`
        border: 2px solid #3f50b5;
      `}
    ${(props) =>
      props.disabled &&
      css`
        border: 1px solid rgb(195, 195, 195);
      `}
  }

  ${(props) =>
    props.selected &&
    css`
      border: 2px solid #3f50b5;
    `}
`;
