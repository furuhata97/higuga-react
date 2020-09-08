import styled from 'styled-components';
import { shade } from 'polished';

export const AddContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: #333;

  height: 95%;
  color: #333;

  overflow: scroll;
`;

export const FormContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    margin-bottom: 8px;
    color: #333;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    div {
      & + div {
        margin-top: 8px;
      }
    }
  }
`;

export const ImageInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  img {
    width: 180px;
    height: 180px;
    border-radius: 10%;

    @media (max-width: 400px) {
      height: 120px;
      width: 120px;
    }
  }

  label {
    position: relative;
    width: 48px;
    height: 48px;
    background: #ff9000;
    border-radius: 50%;
    right: 40px;
    bottom: -70px;
    border: 0;
    cursor: pointer;
    transition: background-color 0.2s;

    display: flex;
    align-items: center;
    justify-content: center;

    input {
      display: none;
    }

    svg {
      height: 20px;
      width: 20px;
      color: #312e38;
    }

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }
  }
`;
