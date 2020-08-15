import styled from 'styled-components';
import { Form as Unform } from '@unform/web';
import { darken } from 'polished';

export const Form = styled(Unform)`
  padding: 24px 0;
  display: flex;
  flex-direction: column;

  h1 {
    font-weight: 500;
    font-size: 36px;
    line-height: 36px;
    margin-bottom: 32px;

    @media (max-width: 660px) {
      font-weight: 300;
      font-size: 24px;
      margin-bottom: 12px;
    }
  }

  div {
    margin-top: 48px;
    align-self: flex-end;
  }

  @media (max-width: 660px) {
    padding: 4px;
    height: 100%;

    > div {
      height: 25px;
      margin-top: 12px;
      & + div {
        margin-top: 6px;
      }
    }

    input {
      height: 20px;
      &::placeholder {
        font-size: 12px;
      }
    }
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;

  button {
    margin-top: 48px;
    align-self: flex-end;

    & + button {
      margin-left: 8px;
    }

    @media (max-width: 600px) {
      align-self: center;
      margin-top: 12px;

      & + button {
        margin-left: 0;
      }
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    width: 100%;
    margin-bottom: 4px;
    margin-top: auto;
  }
`;

export const SaveButton = styled.button`
  font-weight: 500;
  border-radius: 8px;
  border: 0;
  background: #39b100;
  color: #fff;

  display: flex;
  flex-direction: row;
  align-items: center;
  width: auto;

  &:hover {
    background: ${darken(0.1, '#39b100')};
  }

  .text {
    padding: 16px 24px;
  }

  .icon {
    display: flex;
    padding: 16px 16px;
    background: #41c900;
    border-radius: 0 8px 8px 0;
    margin: 0 auto;
  }

  @media (max-width: 660px) {
    .text {
      padding: 12px 20px;
      font-size: 12px;
    }

    .icon {
      svg {
        height: 16px;
        width: 16px;
      }
    }
  }
`;
export const CancelButton = styled.button`
  font-weight: 600;
  border-radius: 8px;
  border: 0;
  background: #aa2727;
  color: #fff;

  display: flex;
  flex-direction: row;
  align-items: center;
  width: auto;

  &:hover {
    background: ${darken(0.1, '#aa2727')};
  }

  .text {
    padding: 16px 24px;
  }

  .icon {
    display: flex;
    padding: 16px 16px;
    background: #df5664;
    border-radius: 0 8px 8px 0;
    margin: 0 auto;
  }

  @media (max-width: 660px) {
    .text {
      padding: 12px 20px;
      font-size: 12px;
    }

    .icon {
      svg {
        height: 16px;
        width: 16px;
      }
    }
  }
`;
