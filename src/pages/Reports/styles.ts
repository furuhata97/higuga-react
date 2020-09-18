import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  p {
    font-weight: 300;

    & + button {
      margin-top: 8px;
    }
  }

  button {
    width: 100%;
    height: 64px;
    border: 0;
    background: #333;
    color: #f2f2f2;

    &:hover {
      background: ${shade(0.2, '#333')};
    }

    & + button {
      border-top: 1px solid #fff;
    }
  }

  color: #333;
`;
