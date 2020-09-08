import styled from 'styled-components';
import { shade } from 'polished';

export const Header = styled.header`
  min-height: 70px;
  background: rgba(170, 67, 0, 0.84);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  width: 100%;

  button {
    display: flex;
    align-items: center;
    background: transparent;
    border: 0;
    color: #f2f2f2;

    &:hover {
      color: ${shade(0.2, '#f2f2f2')};
    }
  }

  img {
    max-height: 75px;

    @media (max-width: 450px) {
      max-height: 50px;
    }

    @media (max-width: 320px) {
      max-height: 45px;
    }
  }
`;
